
import { error } from '@sveltejs/kit';
import { getPlan } from "@apis/queries";

/** @type {import('./$types').PageLoad} */
export async function load({ params }) {
    if (params.uid !== "") {
        let obj = await getPlan(params.uid);
        return JSON.parse(JSON.stringify(obj));
    }

    throw error(404, 'Not found');
}