import { UID } from "@socialcap/contracts";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";


export async function joinCommunity(params: any) {
  const { communityUid, personUid} = params;

  const members = await prisma.members.findFirst({
    where: { AND: [
      { personUid: { equals: personUid }},
      { communityUid: { equals: communityUid }}
    ]},    
  })
  if (members)
    raiseError.BadRequest("Already a member of this community !")

  let memberUid = communityUid+personUid;
  let rsm = await updateEntity("members", memberUid, {
    communityUid: communityUid,
    personUid: personUid,
    role: "0", // PENDING, must start as Pending. Admin should accept.
    new: true
  })

  return hasResult({
    member: rsm.proved,
    transaction: rsm.transaction
  }); 
}


export async function updateMemberRole(params: {
  communityUid: string,
  personUid: string, 
  role: number,
  user: any
}) {
  const { communityUid, personUid, role } = params;

  if (! [0,1,2,3].includes(role))
    raiseError.BadRequest("Can not update this invalid role !")

  // first get current instance 
  let memberUid = communityUid+personUid;

  // update partially 
  let rs = await updateEntity("members", memberUid, {
    communityUid: communityUid,
    personUid: personUid,
    role: role+""
  })

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}


export async function promoteMember(params: any) {
  const { communityUid, personUid, role } = params;

  if (! ["2","3"].includes(role))
    raiseError.BadRequest("Can not promote this invalid role !!!!!")

  const members = await prisma.members.findFirst({
    where: { AND: [
      { personUid: { equals: personUid }},
      { communityUid: { equals: communityUid }}
    ]},    
  })
  if (! members) 
    raiseError.BadRequest("Not a member !");

  let memberUid = communityUid+personUid;
  let rsm = await updateEntity("members", memberUid, {
    communityUid: communityUid,
    personUid: personUid,
    role: role, // 2 | 3 
    new: params.new
  })

  return hasResult({
    member: rsm.proved,
    transaction: rsm.transaction
  }); 
}
