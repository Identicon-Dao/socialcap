
import { error } from '@sveltejs/kit';
import { getCommunity} from '@apis/queries';
/** @type {import('./$types').PageLoad} */
export async function load({ params }) {

    if (params.uid !== "") {
        let obj = await getCommunity(params.uid);
        if (!obj)
            throw error(404, 'Community Not found');
        return JSON.parse(JSON.stringify(obj));
    }
    throw error(404, 'Not found');
}