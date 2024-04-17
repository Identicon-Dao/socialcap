import { error } from '@sveltejs/kit';
import { getClaim } from "@apis/queries";

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  if (params.uid !== "") {
    let claim = await getClaim(params.uid);
      if (!claim)
        throw error(404, 'Claim Not found');
    
      return JSON.parse(JSON.stringify(claim));
    }
    throw error(404, 'Not found');
}
