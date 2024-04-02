import { error } from '@sveltejs/kit';
import { getPlan, getCommunity, getClaim } from "@apis/queries";
import { getCurrentUser } from '@models/current-user';


async function loadClaim(claimUid) {
  let claim = await getClaim(claimUid);

  const plan = await getPlan(claim.planUid);

  const org = await getCommunity(claim.communityUid);

  claim.community = org.name;
  claim.type = plan.name;
  claim.description = plan.description;
  claim.image = plan.image; 

  return claim; 
}


/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  if (params.uid !== "") {
      let aClaim = await loadClaim(params.uid);
      if (!aClaim)
        throw error(404, 'Claim Not found');
      aClaim.evidenceData = typeof(aClaim.evidenceData) === 'string'
        ? JSON.parse(aClaim.evidenceData)
        : aClaim.evidenceData;
      return JSON.parse(JSON.stringify(aClaim));
    }
    throw error(404, 'Not found');
}
