/**
 * Params: 
 *  slug uid: the UID of the Master Plan
 */
import { error } from '@sveltejs/kit';
import { getTask } from "@apis/queries";

// this is only for testing/mockups

/** @type {import('./$types').PageLoad} */
export async function load({ params, route, url }) {
    if (params.uid !== "") {
      let aTask = await getTask(params.uid);
      if (!aTask)
        throw error(404, 'Task Not found');
      console.log("@aTask", aTask);
      return JSON.parse(JSON.stringify(aTask)); 
    }
    throw error(404, 'Not found');
}
