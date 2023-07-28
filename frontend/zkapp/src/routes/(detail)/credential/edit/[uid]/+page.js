/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { UID } from "@utilities/uid";

import { getPlan, getCommunity, getClaim } from "@apis/queries";
import { getCurrentUser } from '@models/current-user';

async function initNewClaim(params, user) {
  const planUid = params.uid;

  const plan = await getPlan(planUid);

  const community = await getCommunity(plan.communityUid);

  let oClaim = {
    uid: UID.uuid4(),
    communityUid: plan.communityUid,
    planUid: plan.uid,
    applicantUid: user.uid,
    accountId: "",
    // derived form MasterPlan name for this credential
    type: plan.name, 
    description: plan.description,
    state: 1, // DRAFT
    community: community.name,
    image: plan.image, 
    // activity times
    createdUTC: null,
    updatedUTC: null,
    votedUTC: null,
    issuedUTC: null,
    dueUTC: plan.dueUTC,
    // voting results
    requiredVotes: plan.requiredVotes, // copied from MasterPlan
    requiredPositives: plan.requiredPositives,
    positiveVotes: 0,
    negativeVotes: 0,
    ignoredVotes: 0,
    // evidence data
    evidenceData: (plan.evidence || []).map((f) => {
      f.value = "";
      return f;
    })
  };

  return { 
    claim: oClaim, 
    plan: plan,
    community: community,
    isNew: true 
  }; 
}


async function loadClaim(params, user) {
  const claimUid = params.uid;

  let claim = await getClaim(claimUid);

  const plan = await getPlan(claim.planUid);

  const org = await getCommunity(claim.communityUid);

  claim.community = org.name;
  claim.type = plan.name;
  claim.description = plan.description;
  claim.image = plan.image; 

  return { 
    claim: claim, 
    plan: plan,
    community: org,
    isNew: false 
  }; 
}


/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  if (params.slug !== "") {
      let user = await getCurrentUser();
      const isNew = url.searchParams.get('isnew', null);

      return ((isNew !== null)
        ? await initNewClaim(params, user) 
        : await loadClaim(params, user)
      )  
    }
    throw error(404, 'Not found');
}
