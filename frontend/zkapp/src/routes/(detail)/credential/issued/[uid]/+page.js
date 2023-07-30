/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { getCurrentUser } from '@models/current-user';
import {getOwnerSbtTokens} from '$lib/near/sbt';

// this is only for testing/mockups
import { aCredential } from '@models/mockup-objects';

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
    if (params.uid !== "") {
      const user = getCurrentUser();
      const credential = aCredential;
      // const userSbts = await sbt.getOwnerSbtTokens();
      return {...JSON.parse(JSON.stringify(credential))}; 
    }
    throw error(404, 'Not found');
}
