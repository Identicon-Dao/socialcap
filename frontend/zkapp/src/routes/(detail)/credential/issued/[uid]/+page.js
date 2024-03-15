/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { getCredential } from '@apis/queries';

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
    if (params.uid !== "") {
      const aCredential = await getCredential(params.uid)
      if (!obj)
        throw error(404, 'Credential Not found');
      return JSON.parse(JSON.stringify(aCredential)); 
    }
    throw error(404, 'Not found'); 
}
