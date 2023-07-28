import { UID } from "@socialcap/contracts";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";


export async function getCommunity(params: any) {
  const uid = params.uid;
  let data = await getEntity("community", uid);
  return hasResult(data); 
}


/**
 * Extends the getCommunity() to return information only available
 * to its administrator, such as pending validators approvals, 
 * masterplans, etc...
 */
export async function getAdminedCommunity(params: any) {
  const uid = params.uid;

  let data = await getEntity("community", uid);

  // check if user is the Admin
  if (!(data.adminUid === params.user.uid)) 
    raiseError.ForbiddenError("Not the Admin of this community !");

  const plans = await prisma.plan.findMany({
    where: { communityUid: { equals: uid }},    
    orderBy: { name: 'asc' }
  })

  const proposed = await prisma.proposed.findMany({
    where: { communityUid: { equals: uid }},    
    orderBy: { role: 'asc' }
  })

  // members count
  const membersCount = await prisma.members.count({
    where: { AND: [
      { communityUid: { equals: uid } },
      { role: { in: ["1", "2", "3"] }}    
    ]}  
  })

  // credentials count
  const credentialsCount =  await prisma.credential.count({
    where: { communityUid: { equals: uid } }  
  })

  // claims count
  const claimsCount =  await prisma.claim.count({
    where: { communityUid: { equals: uid } }  
  })

  data.plans = plans || [];
  data.proposed = proposed || [];
  data.membersCount = membersCount || 0;
  data.credentialsCount = credentialsCount || 0;
  data.claimsCount = claimsCount || 0;

  return hasResult(data); 
}


export async function updateCommunity(params: any) {
  const uid = params.new 
    ? UID.uuid4() // ONLY when we receive this we assign a new UID
    : params.uid; 

  let rs = await updateEntity("community", uid, params);
  let cm = rs.proved;

  let memberUid = cm.uid+cm.adminUid;
  await updateEntity("members", memberUid, {
    communityUid: cm.uid,
    personUid: cm.adminUid,
    role: "1", // PLAIN,
    new: params.new
  })

  return hasResult({
    community: rs.proved,
    transaction: rs.transaction
  }); 
}


export async function getMyCommunities(params: any) {
  const userUid = params.user.uid;

  const members = await prisma.members.findMany({
    where: { personUid: userUid }
  })
  const cuids  = members.map((t) => t.communityUid);

  const communities = await prisma.community.findMany({
    where: { uid: { in: cuids } },
    orderBy: { name: 'asc' }
  })

  return hasResult(communities);
}


export async function getAllCommunities(params: any) {
  const userUid = params.user.uid;

  // this are the ones where the user has joined
  const members = await prisma.members.findMany({
    where: { personUid: userUid }
  })
  const cuids  = members.map((t) => t.communityUid);
  
  const joined = params.notJoined ? cuids : [];
  const communities = await prisma.community.findMany({
    where: { uid: { notIn: joined }},
    orderBy: { name: 'asc' }
  })

  return hasResult(communities);
}
