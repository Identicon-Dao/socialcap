import { UID } from "@socialcap/contracts";
import { CLAIMED, WAITING, UNPAID, VOTING } from "@socialcap/contracts";
import { fastify, prisma, logger } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { waitForTransaction } from "../services/mina-transactions.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";
import { startClaimVotingProcess } from "../services/voting-process.js";

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
    where: { AND: [
      { personUid: { equals: userUid }}
    ],
    NOT: {
      role: { equals: "0"} // NOT PENDING ROLE
    }},    
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
 * Gets all claim instance data that are in a voting state (CLAIMED).
 * We need them for doing rollups over and over again.
 * @param params 
 */
export async function getRunningClaims(params: any) {
  // all commnunity Uids where is a a member
  const claims = await prisma.claim.findMany({
    where: { state: CLAIMED },
    orderBy: { createdUTC: 'asc' }
  })
  return hasResult({
    claims: claims || []
  })
}


/**
 * Mutations
 */
export async function addClaim(params: any) {
  const uid = UID.uuid4(); // a new plan
  params.new = true;

  params.evidenceData = JSON.stringify(params.evidenceData || "[]");
  params.state = parseInt(params.state || 1);
  params.createdUTC = (new Date()).toISOString();
  params.updatedUTC = params.createdUTC;
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

export async function updateClaimState(params: {
  uid: string,
  state: number,
  user: any
}) {
  const uid = params.uid;

  // firts get the current instance
  let data = await getEntity("claim", uid);

  // change just the state and update
  data.state = params.state || 1;

  let rs = await updateEntity("claim", uid, params);

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}


export async function submitClaim(params: {
    claim: any,
    extras: any,
    user: any
  }) {
  const claim = params.claim;
  const uid = claim.uid;
  let {transaction, waitForPayment, addToQueue} = params.extras ;

  let rs: any;
  claim.evidenceData = JSON.stringify(claim.evidenceData || "[]");
  claim.state = parseInt(claim.state || 1);

  // check if we need to add it to the ClaimsQueue for latter processing
  if (addToQueue) {
    // we dont need to wait for payment, so we mark it as CLAIMED right now
    // the voting process will be started by the ClaimsQueue processor
    claim.state = CLAIMED; 
    rs = await updateEntity("claim", uid, claim);
  }

  // check if we need to wait for Payment
  if (waitForPayment) {
    // we mark it as WAITING because we are not sure we will receive payment
    claim.state = WAITING; // waiting before not yet paid ...
    rs = await updateEntity("claim", uid, claim);

    waitForTransaction(
      transaction.hash, 
      params, 
      async (params: any) => {
        params.state = CLAIMED;
        await updateEntity("claim", params.uid, params);
        console.log("Succcess. Must start the voting process.");

        // we dont await for it, we just let it start whenever it can
        startClaimVotingProcess(params);
      }, 
      async (params: any, err: any) => {
        logger.error(err);
        params.state = UNPAID; // Payment failed, must repay and resend
        await updateEntity("claim", params.uid, params);
      }
    );
  }

  return hasResult({
    claim: rs.proved,
    transaction: rs.transaction
  }); 
}
