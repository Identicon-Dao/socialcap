/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { UID } from "@utilities/uid";
import { getPlan, getCommunity, getClaim } from "@apis/queries";
import { getCurrentUser } from '@models/current-user';
import { fixEvidenceData } from './fix-evidence-data';





/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
  // const claimUid = url.searchParams.get("uid", null);
  // console.log("uid", url.params);
  // if (claimUid !== "") {
      // let user = await getCurrentUser();
}
