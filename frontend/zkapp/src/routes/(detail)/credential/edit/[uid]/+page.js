/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { getClaim } from "@apis/queries";
import { getCurrentSession } from '@models/current-session';
import { goto } from '$app/navigation';
/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  // check logged in 
  // const user = await getCurrentUser();
  // console.log("user", user)
  let isAuthenticated = getCurrentSession();
  console.log("is auth?", isAuthenticated)
  if (!isAuthenticated) {

    goto("/login");
  }

  if (params.uid !== "") {
    const isNew = url.searchParams.get('isnew', null);
    if (isNew === null) {
      let claim = await getClaim(params.uid);
      if (!claim)
        throw error(404, 'Claim Not found');
      return { isNew: false, claimUid: params.uid, claim }
    }

    return { isNew: true, planUid: params.uid, claim: null }
  }
  throw error(400, 'Not found');
}