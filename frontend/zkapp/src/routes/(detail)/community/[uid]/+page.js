
import { error } from '@sveltejs/kit';
import { getClaimables } from "@apis/clients";
import { getCommunity } from '@apis/queries';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    if (params.uid !== "") {
        let obj = await getCommunity(params.uid);
        obj.claimables = []; // await getClaimables(params.uid)
        return JSON.parse(JSON.stringify(obj));
    }
    throw error(404, 'Not found');
}