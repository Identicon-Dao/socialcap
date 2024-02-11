import { error } from '@sveltejs/kit';
import { goto } from '$app/navigation';
import { getCurrentSession } from '@models/current-session';
import { getCurrentUser } from '@models/current-user';
import { setApiClient } from '$lib/globals';
import { API_CONFIG } from '@apis/config';
import { CoreAPIClient } from '@apis/core-api-client';
import { ASSIGNED, ACTIVE } from '@models/states';
import { getMyCommunities, getAllCommunities } from "@apis/queries";
import { getMyClaimables, getMyClaims } from '@apis/queries';
import { getTask, getMyTasks } from '@apis/queries';
import { getMyCredentials } from '@apis/queries';
import { getMyHome } from '@apis/queries';

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
    console.log("+page.js load()");

    let isAuthenticated = getCurrentSession();
    let user;
    let rs = {};

    if (!isAuthenticated) {
      let client = new CoreAPIClient(API_CONFIG);  
      setApiClient(client);
      goto("/login");
    }
      
    if (isAuthenticated) {
      let client = new CoreAPIClient(isAuthenticated);  
      setApiClient(client);
      user = await getCurrentUser();
      //console.log("getmyHome= ", JSON.stringify(home, null, 4));
      rs =  await getMyHome();

      if (rs) {
        rs.user = user;
        rs.isAuthenticated = isAuthenticated;
        rs.assigned = (rs.assigned || []).filter((t) => t.state=== ASSIGNED),
        rs.stats = aStats;
        // order claim by createdUTC desc
        rs.claimed = rs.claimed.sort((a, b) => new Date(b.createdUTC) - new Date(a.createdUTC) );
        rs.claimables = (rs.claimables || []).filter((t) => t.state === ACTIVE);
        console.log("main page data=", rs);
      }
    }  

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