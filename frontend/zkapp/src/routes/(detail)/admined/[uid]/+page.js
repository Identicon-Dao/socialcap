
import { error } from '@sveltejs/kit';

import { getAdminedCommunity, getVotingStatus } from '@apis/queries';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    if (params.uid !== "") {
        let obj = await getAdminedCommunity(params.uid);
        let votingStatus = await getVotingStatus(params.uid);
        console.log("voting status", votingStatus)
        console.log("data", obj)
        return JSON.parse(JSON.stringify(obj));
    }

    throw error(404, 'Not found');
}