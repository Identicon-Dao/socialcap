/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { getClaim } from "@apis/queries";

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {

  if (params.uid !== "") {
      const isNew = url.searchParams.get('isnew', null);
      if (isNew === null) {
        let claim = await getClaim(claimUid);
        if (!claim)
          throw error(404, 'Claim Not found');
        return {isNew: false, claimUid: params.uid, claim}
      }

      return {isNew: true, planUid: params.uid}
    }
    throw error(400, 'Not found');

}