import { apiClient, AppStatus } from "$lib/globals";
import { monitorMINATransaction } from "./monitors";

export { 
  updateProfile, 
  updateCommunity, 
  joinCommunity,
  attachPlan,
  updatePlan,
  addClaim,
  updateClaim,
  submitClaim 
}


async function updateProfile(data: any): Promise<any> {
  AppStatus.push("Updating profile ...");  

  let rs = await apiClient.mutate("update_profile", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Profile updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.profile;
}


async function updateCommunity(data: any): Promise<any> {
  AppStatus.push("Updating community ...");  

  let rs = await apiClient.mutate("update_community", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Community updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.community;
}


async function joinCommunity(data: any): Promise<any> {
  AppStatus.push("Adding as member to a community ...");  
  let { communityUid, personUid } = data;

  let rs = await apiClient.mutate("join_community", {
    communityUid: communityUid,
    personUid: personUid
  });
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Member added !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.member;
}

/**
 * Attachs a new plan to a given community
 */
async function attachPlan(data: any): Promise<any> {
  AppStatus.push("Adding a Master plan to this community ...");  

  let rs = await apiClient.mutate("add_plan", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Profile updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.plan;
}

async function updatePlan(data: any): Promise<any> {
  AppStatus.push("Updating the master plan ...");  

  let rs = await apiClient.mutate("update_plan", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Profile updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.plan;
}


/**
 * Claim mutations: addClaim, updateClaim, submitClaim
 */
async function addClaim(data: any): Promise<any> {
  AppStatus.push("Creating the Claim #"+data.uid);  

  let rs = await apiClient.mutate("add_claim", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Claim created !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.claim;
}

async function updateClaim(data: any): Promise<any> {
  AppStatus.push("Updating the Claim #"+data.uid);  

  let rs = await apiClient.mutate("update_claim", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Claim updated !");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.claim;
}

/** This really starts the voting process */
async function submitClaim(data: any): Promise<any> {
  AppStatus.push("Submitting the Claim #"+data.uid);  

  let rs = await apiClient.mutate("submit_claim", data);
  if (rs.error) {
    AppStatus.error("There is some error with the data, please review !");
    return null;
  }  
  AppStatus.push("Claim submitted. The voting process will start soon ...");  
  
  AppStatus.push("Now waiting for MINA transaction to complete");  
  monitorMINATransaction(rs.data.transaction.id);

  return rs.data.claim;
}
