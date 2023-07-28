import { UID } from "@socialcap/contracts";
import { fastify, prisma } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";


export async function getPlan(params: any) {
  const uid = params.uid;
  let data = await getEntity("plan", uid);
  data.evidence = JSON.parse(data.evidence);
  data.strategy = JSON.parse(data.strategy);
  return hasResult(data); 
}


export async function addPlan(params: any) {
  const uid = UID.uuid4(); // a new plan
  params.new = true;

  let rs = await updateEntity("plan", uid, params);

  return hasResult({
    plan: rs.proved,
    transaction: rs.transaction
  }); 
}


export async function updatePlan(params: any) {
  const uid = params.uid;

  params.evidence = JSON.stringify(params.evidence || "[]");
  params.strategy = JSON.stringify(params.strategy || "{}");
  params.state = parseInt(params.state || 1);
  let rs = await updateEntity("plan", uid, params);

  return hasResult({
    plan: rs.proved,
    transaction: rs.transaction
  }); 
}
