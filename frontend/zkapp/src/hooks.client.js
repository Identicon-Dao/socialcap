import { getCurrentSession } from '@models/current-session';
import { getCurrentUser } from '@models/current-user';
import { setApiClient } from '$lib/globals';
import { CoreAPIClient } from '@apis/core-api-client';
import { API_CONFIG } from '@apis/config';

console.log("hook.client.js", API_CONFIG);

let isAuthenticated = getCurrentSession();
let user;


if ('serviceWorker' in navigator) {
  console.log('hook.clients.js: serviceWorker in navigator')
}


if (isAuthenticated) {
  let client = new CoreAPIClient(isAuthenticated);  
  setApiClient(client);
  user = await getCurrentUser();
} 
else {
  let client = new CoreAPIClient(API_CONFIG);  
  setApiClient(client);
}

// we must wait before loading Snarky and contracts
// so we give time for the UI to appear 
//AppStatus.push("Please wait ... we are not ready yet ...");
setTimeout(() => {
  //loadSnarky();
}, 5000);
