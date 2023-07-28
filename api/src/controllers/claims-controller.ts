import { UID } from "@socialcap/contracts";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";

type Claimable = {
  uid: string, // the UID of the MasterPlan ...
  communityUid: string,
  state: number,
  community: string,
  name: string, 
  description: string,
  image: string,
  startsUTC: string,
  endsUTC: string,
  available: number,
  total: number,
  fee: number
}


export async function getClaim(params: any) {
  const uid = params.uid;
  let data = await getEntity("claim", uid);
  data.evidenceData = JSON.parse(data.evidenceData || "[]");
  return hasResult(data); 
}

export async function getMyClaims(params: any) {
  const userUid = params.user.uid;

  // all commnunity Uids where is a a member
  const claims = await prisma.claim.findMany({
    where: { applicantUid: userUid },
    orderBy: { createdUTC: 'asc' }
  })
  if (! claims) 
    return hasResult([]);

    
  const planUids  = claims.map((t) => t.planUid);
  const plans = await prisma.plan.findMany({
    where: { uid: { in: planUids } }
  })
  const mapPlans: any = {};
  (plans || []).map((t) => { mapPlans[t.uid] = t;})
    
  const cmnUids  = claims.map((t) => t.communityUid);
  const orgs = await prisma.community.findMany({
    where: { uid: { in: cmnUids } }
  })
  const mapOrgs: any = {};
  (orgs || []).map((t) => { mapOrgs[t.uid] = t;})

  // and patch some additional data into each Claim
  let claimed = (claims || []).map((t: any) => {
    const org = mapOrgs[t.communityUid];
    const plan = mapPlans[t.planUid];
    t.community = org.name;
    t.type = plan.name;
    t.description = plan.description;
    t.image = plan.image; 
    return t; 
  })

  return hasResult(claimed);
}

export async function getMyClaimables(params: any) {
  const userUid = params.user.uid;

  // all commnunity Uids where is a a member
  const members = await prisma.members.findMany({
    where: { personUid: userUid }
  })
  const cuids  = members.map((t) => t.communityUid);
  if (! members)
    return hasResult([]); // no claimables as is not member in any Dao

  // now all the master plans in each of those communities
  const plans = await prisma.plan.findMany({
    where: { communityUid: { in: cuids } },
    // TODO: we should also filter by state
    orderBy: { name: 'asc' }
  })
  if (! plans)
    return hasResult([]); // no available master plan 
  
  // now we need the communities to extract some data 
  // because joins are not really available in Prisma?
  // now all the master plans in each of those communities
  const orgs = await prisma.community.findMany({
    where: { uid: { in: cuids } },
    orderBy: { name: 'asc' }
  })

  let dictio: Map<string,any> = new Map();
  (orgs || []).forEach((t: any) => {
    dictio.set(t.uid, t);
  })

  // and patch some additional data into the Claimables
  let claimables = (plans || []).map((t: any) => {
    let cmn = dictio.get(t.communityUid);
    return {
      uid: t.uid, // the UID of the MasterPlan ...
      communityUid: t.communityUid,
      state: t.state,
      community: cmn.name,
      name: t.name, 
      description: t.description,
      image: t.image,
      startsUTC: t.startsUTC,
      endsUTC: t.endsUTC,
      available: t.available,
      total: t.total,
      fee: t.fee
    } as Claimable;
  })

  return hasResult(claimables);
}


/**
 * Mutations
 */

export async function addClaim(params: any) {
  const uid = UID.uuid4(); // a new plan
  params.new = true;

  params.evidenceData = JSON.stringify(params.evidenceData || "[]");
  params.state = parseInt(params.state || 1);
  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}

export async function updateClaim(params: any) {
  const uid = params.uid;

  params.evidenceData = JSON.stringify(params.evidenceData || "[]");
  params.state = parseInt(params.state || 1);
  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}

export async function submitClaim(params: any) {
  const uid = params.uid;

  params.evidenceData = JSON.stringify(params.evidenceData || "[]");
  params.state = parseInt(params.state || 1);
  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}
