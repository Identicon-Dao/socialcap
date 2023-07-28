import { apiClient, AppStatus } from "$lib/globals";

export { 
  getMyCommunities,
  getAllCommunities,
  getCommunity,
  getAdminedCommunity,
  getPlan,
  getMyClaimables,
  getMyClaims,
  getClaim
}


async function getCommunity(uid: string): Promise<any> {
  let rs = await apiClient.query("get_community", { uid: uid });
  if (rs.error) return null;
  return rs.data;
}


async function getAdminedCommunity(uid: string): Promise<any> {
  let rs = await apiClient.query("get_admined_community", { uid: uid });
  if (rs.error) return null;
  return rs.data;
}


async function getMyCommunities(): Promise<any[]> {
  let rs = await apiClient.query("get_my_communities", {});
  if (rs.error) return [];
  return rs.data;
}


async function getAllCommunities(params: any): Promise<any[]> {
  let rs = await apiClient.query("get_all_communities", params);
  if (rs.error) return [];
  return rs.data;
}


async function getPlan(uid: string): Promise<any> {
  let rs = await apiClient.query("get_plan", { uid: uid });
  if (rs.error) return null;
  return rs.data;
}


async function getMyClaimables(params: any): Promise<any[]> {
  let rs = await apiClient.query("get_my_claimables", params);
  if (rs.error) return [];
  return rs.data;
}

async function getMyClaims(params: any): Promise<any[]> {
  let rs = await apiClient.query("get_my_claims", params);
  if (rs.error) return [];
  return rs.data;
}

async function getClaim(uid: string): Promise<any> {
  let rs = await apiClient.query("get_claim", { uid: uid });
  if (rs.error) return null;
  return rs.data;
}


