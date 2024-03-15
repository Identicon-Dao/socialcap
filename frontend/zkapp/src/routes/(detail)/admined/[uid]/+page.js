
import { error } from '@sveltejs/kit';

import { getAdminedCommunity } from '@apis/queries';

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    if (params.uid !== "") {
        let obj = await getAdminedCommunity(params.uid);
        if (!obj)
            throw error(404, 'Community Not found');
        console.log("data", obj)
        return JSON.parse(JSON.stringify(obj));
    }

    throw error(404, 'Not found');
}