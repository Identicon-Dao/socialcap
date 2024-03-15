
import { error } from '@sveltejs/kit';
import { getCommunity, getMyClaims, getMyCredentials } from '@apis/queries';
import { APPROVED } from "@models/states";
import { getCurrentUser } from '@models/current-user';
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    if (params.uid !== "") {
        let obj = await getCommunity(params.uid);
        if (!obj)
            throw error(404, 'Community Not found');
        const claimed = await getMyClaims(params);
        let user = await getCurrentUser();
        const credentials = await getMyCredentials({user, communityUid: params.uid});
        obj.claimed = claimed;
        obj.credentials = credentials;
        obj.approvedClaims = obj.claims.filter((c) => c.state == APPROVED);
        obj.claimables = []; // await getClaimables(params.uid)
        return JSON.parse(JSON.stringify(obj));
    }
    throw error(404, 'Not found');
}