import { getCurrentSession } from '@models/current-session';
import { getCurrentUser } from '@models/current-user';
import { setApiClient } from '$lib/globals';
import { CoreAPIClient } from '@apis/core-api-client';

console.log("hook.client.js");

let isAuthenticated = getCurrentSession();
let user;

if (isAuthenticated) {
  let client = new CoreAPIClient(isAuthenticated);  
  setApiClient(client);
  user = await getCurrentUser();
} 
else {
  let client = new CoreAPIClient(false);  
  setApiClient(client);
}

// we must wait before loading Snarky and contracts
// so we give time for the UI to appear 
//AppStatus.push("Please wait ... we are not ready yet ...");
setTimeout(() => {
  //loadSnarky();
}, 5000);
