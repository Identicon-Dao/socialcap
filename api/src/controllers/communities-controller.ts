import * as fs from "fs";
import { UID } from "@socialcap/contracts";
import { prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { CLAIMED, DRAFT } from "@socialcap/contracts";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { CommunityMembers } from "../dbs/members-helper.js";
import { getCommunityClaims, getCommunityCounters, getCommunityClaimsByPlan } from "../dbs/community-helpers.js";


export async function getCommunity(params: any) {
  const uid = params.uid;
  let data = await getEntity("community", uid);
  
  let counters = await getCommunityCounters(uid);
  data = Object.assign(data, counters);

  let members = await (new CommunityMembers()).build(uid);
  data.members = members.getAll();
  data.validators = members.getValidators();
  
  data.claims = await getCommunityClaims(uid, members);

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
  if (!(data.adminUid === params.user.uid || data.xadmins.includes(params.user.uid))) 
    raiseError.ForbiddenError("Not the Admin of this community !");

  const plans = await prisma.plan.findMany({
    where: { communityUid: { equals: uid }},    
    orderBy: { name: 'asc' }
  })
  data.plans = plans || [];

  const proposed = await prisma.proposed.findMany({
    where: { communityUid: { equals: uid }},    
    orderBy: { role: 'asc' }
  })
  data.proposed = proposed || [];

  let members = await (new CommunityMembers()).build(uid);
  data.members = members.getAll();
  data.validators = members.getValidators();

  const counters = await getCommunityCounters(uid);
  data = Object.assign(data, counters);

  data.claims = await getCommunityClaims(uid, members);

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
    role: "0", // PLAIN,
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

  let communities = await prisma.community.findMany({
    where: { uid: { in: cuids } },
    orderBy: { name: 'asc' }
  })

  // for each community count members and claims and credentials
  for (let j=0; j < (communities || []).length; j++) {
    let cm = communities[j] as any;
    let counters = await getCommunityCounters(cm.uid);
    cm = Object.assign(cm, counters);
    console.log(cm.uid, cm.counters);
    communities[j] = cm;
  }

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


export async function prepareCommunityClaimsDownload(
  uid: string, 
  fileName: string,
  states?: string
) {
  try {
    let members = await (new CommunityMembers()).build(uid);
 
    let claims = await getCommunityClaims(uid, members, [DRAFT,CLAIMED]) || [];

    let content = "";

    // if no claims we return an empty file
    if (! claims.length) {
      fs.writeFileSync(fileName, "", { flag: 'w+' });      
      return true;
    }
    
    // prepare headers, use first available row
    let fields = JSON.parse(claims[0].evidenceData) || [];

    let headers = ['"Full Name"','"Claim Id"','"Status"'];
    fields.forEach((field: any) => {
      if (field.type !== 'remark') 
        headers.push(`"${field.label}"`);
    })
    content = content + headers.join(',') + '\n';

    // now traverse claims and its fields
    claims.forEach((claim: any) => {
      let fields = JSON.parse(claim.evidenceData) || [];

      let stateDescr;
      if (claim.state === 1) stateDescr = "DRAFT"; 
      if (claim.state === 4) stateDescr = "CLAIMED"; 

      let values = [
        `"${claim.applicant?.fullName || ''}"`,
        `"${claim.uid}"`,
        `"${stateDescr}"`
      ];
      fields.forEach((field: any) => {
        if (field.type !== 'remark') 
          values.push(`"${valueToString(field)}"`);
      })

      content = content + values.join(',') + '\n';
    })

    // write it now
    fs.writeFileSync(fileName, content, { flag: 'w+' });      
    
    return true; 
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

export async function prepareCommunityPlanClaimsDownload(
  uid: string,
  planUid: string,
  fileName: string,
  states?: string
) {
  try {
    let members = await (new CommunityMembers()).build(uid);
 
    let claims = await getCommunityClaimsByPlan(uid, planUid, members, [DRAFT,CLAIMED]) || [];

    let content = "";

    // if no claims we return an empty file
    if (! claims.length) {
      fs.writeFileSync(fileName, "", { flag: 'w+' });      
      return true;
    }
    
    // prepare headers, use first available row
    let fields = JSON.parse(claims[0].evidenceData) || [];

    let headers = ['"Full Name"','"Claim Id"','"Status"'];
    fields.forEach((field: any) => {
      if (field.type !== 'remark') 
        headers.push(`"${field.label}"`);
    })
    content = content + headers.join(',') + '\n';

    // now traverse claims and its fields
    claims.forEach((claim: any) => {
      let fields = JSON.parse(claim.evidenceData) || [];

      let stateDescr;
      if (claim.state === 1) stateDescr = "DRAFT"; 
      if (claim.state === 4) stateDescr = "CLAIMED"; 

      let values = [
        `"${claim.applicant?.fullName || ''}"`,
        `"${claim.uid}"`,
        `"${stateDescr}"`
      ];
      fields.forEach((field: any) => {
        if (field.type !== 'remark') 
          values.push(`"${valueToString(field)}"`);
      })

      content = content + values.join(',') + '\n';
    })

    // write it now
    fs.writeFileSync(fileName, content, { flag: 'w+' });      
    
    return true; 
  }
  catch (err) {
    console.log(err);
    return false;
  }
}

/**
 * Helpers
 */
function valueToString(field: any) {
  if (['text','note','radio'].includes(field.type))
    return (field.value?.substring(0, 600) || "").replaceAll('"',"'");

  if (['links','files','images','checks'].includes(field.type))
    return (field.value || []).join(',').replaceAll('"',"'");

  return "?";
}
