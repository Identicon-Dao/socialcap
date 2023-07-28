import { error } from '@sveltejs/kit';
import { getCurrentSession } from '@models/current-session';
import { getCurrentUser } from '@models/current-user';
import { setApiClient } from '$lib/globals';
import { CoreAPIClient } from '@apis/core-api-client';
import { getMyCommunities, getAllCommunities } from "@apis/queries"
import { getMyClaimables, getMyClaims } from '@apis/queries';

// this is only for testing/mockups
import { olCredentials, olMyCommunities, olSubmitedClaims, olTasks } from '@models/mockup-objects';

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
    console.log("+page.js load()");

    let isAuthenticated = getCurrentSession();
    let user;

    if (isAuthenticated) {
      let client = new CoreAPIClient(isAuthenticated);  
      setApiClient(client);
      user = await getCurrentUser();
    }  

    let rs = { 
      user: user,
      isAuthenticated: isAuthenticated,
      claimables: await getMyClaimables(),
      credentials: olCredentials, 
      claimed: await getMyClaims(),
      joined: await getMyCommunities(),
      joinables: await getAllCommunities({notJoined: true}),
      allCommunities: await getAllCommunities(),
      assigned: olTasks.filter((t) => t.state==='PENDING'),
      stats: aStats
    }; 
    console.log("main page data=", rs);

    return rs;
}

const aStats = {
  countCredential: 3,
  countCommunities: 30,
  countClaimables: 2,
  claimedCount: 1,
  joinedCount: 3,
  adminsCount: 1
}