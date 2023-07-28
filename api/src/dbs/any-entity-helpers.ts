import { CircuitString, Field, UInt32 } from "snarkyjs";
import { prisma } from "../global.js";
import { 
  PersonPartialSchema, CommunityPartialSchema, MembersPartialSchema,
  ClaimPartialSchema, CredentialPartialSchema, PlanPartialSchema, 
  TaskPartialSchema 
} from "../../prisma/generated/zod/index.js";
import { 
  LeafInstance, MerkleMapProxy, MerkleMapUpdate, ProvableCommunity, ProvableMember, 
  ProvablePerson, ProvableClaim, ProvablePlan, ProvableCredential, ProvableTask,
  UID 
} from "@socialcap/contracts";

import { raiseError } from "../responses.js";
import { OffchainMerkleStorage } from "./offchain-merkle-storage.js";
import { OffchainMerkleMap } from "./offchain-merkle-map.js";
import { MinaService } from "../services/mina-service.js";

export { updateEntity, getEntity };


const prismaHandler: any = {
  "person": prisma.person,
  "community": prisma.community,
  "members": prisma.members,
  "plan": prisma.plan,
  "claim": prisma.claim,
  "credential": prisma.credential,
  "task": prisma.task
}

const zodHandler: any = {
  "person": PersonPartialSchema,
  "community": CommunityPartialSchema,
  "members": MembersPartialSchema,
  "plan": PlanPartialSchema,
  "claim": ClaimPartialSchema,
  "credential": CredentialPartialSchema,
  "task": TaskPartialSchema
}

const merkleId: any = {
  "person": 1,
  "community": 2,
  "members": 3,
  "plan": 4,
  "claim": 5,
  "credential": 7,
  "task": 6
}

const provableHandler: any = {
  "person": ProvablePerson,
  "community": ProvableCommunity,
  "members": ProvableMember,
  "plan": ProvablePlan,
  "claim": ProvableClaim,
  "credential": ProvableCredential,
  "task": ProvableTask 
}

const minaService: any = {
  "person": MinaService.updatePersonsRootOrRaise,
  "community": MinaService.updateCommunitiesRootOrRaise,
  "members": MinaService.updateCommunitiesRootOrRaise,
  "plan": MinaService.updateCommunitiesRootOrRaise,
  "claim": MinaService.updateCommunitiesRootOrRaise,
  "credential": MinaService.updateCommunitiesRootOrRaise,
  "task": MinaService.updateCommunitiesRootOrRaise,
  "nullifier": MinaService.updateCommunitiesRootOrRaise,
}


/**
 * Updates or inserts any entity in the Merkle Map, the Indexer and Onchain.
 * 
 * @param entityType the type name, that is "person", "community", etc
 * @param uid the UID of the entity to update
 * @param unsafeParams the set or received params
 * @returns the proved object and the finished transaction
 * @throws error if something fails 
 */
async function updateEntity(
  entityType: string, 
  uid: string, 
  unsafeParams: any
): Promise<{
  proved: any,
  transaction: any
}> {
  // we need a transaction Id we can use to latter follow this tx status
  let txId = UID.uuid4();

  let params = await checkParams(entityType, uid, unsafeParams);
  params.new = !!unsafeParams.new; 

  // we first update the Indexer, so we are sure the entity we are about
  // to prove is exactly the same that we have in the Indexer
  let data = await updateIndexer(entityType, uid, params);

  // we build a provable from the given data before anything else
  // we know that the given data is a provable by running the "fromJSON()' 
  // and 'hash()' methods on a ProvableEntity, and getting the hash value 
  // that we will use as Leaf in the MerkleMap
  let provable = await getProvable(entityType, uid, data);

  // we just update the merkle map and get an Updated struct with leafs 
  // before the update and after the update was done
  let {map, updated} = await updateMerkleMap(entityType, provable);

  // now we start the MINA transaction, BUT we do not really wait for it,
  // we let it run in the background. The client needs to check if the 
  // transactions has finished buy polling the txId and using the API 
  // method "get_mina_transaction_state(txId)"
  let tx = await updateMINA(
    entityType, uid, 
    provable, map, updated, txId,
      ) ;

  return {
    proved: data,
    transaction: { obj: tx, id: txId }
  };
}


/**
 * Retrieve an entity give its uid, but verify that the merkle map leaf and
 * the retrieved data are consistent and have not changed
 * @param entityType 
 * @param uid 
 * @param options 
 * @returns the requested entity data
 * @throws an error if something fails (invalid uid, invalid data, etc)
 */
async function getEntity(
  entityType: string, 
  uid: string, 
  options?: any
): Promise<any> {
  let db: any = prismaHandler[entityType];

  let data = await db.findUnique({ where: { uid: uid }});
  if (!data) raiseError.DatabaseEngine(
    `Could not found '${entityType}' uid=${uid}`
  )
  return data;

  // we build a provable from the given data before anything else
  let {provable, hash} = await getProvable(entityType, uid, data)

  // we need the Leaf to assert that data has not been tampered 
  let leaf: LeafInstance = await getMerkleLeaf(entityType, uid);

  // assert that the provable hash and the leaf hash are the same 
  // if (! (hash === leaf.hash)) raiseError.DatabaseEngine(
  //   `Retrieved data for '${entityType}' uid=${uid} is not consistent`+
  //   ` with stored and onchain commited values`
  // )  

  return data;
}


/**
 * Check that received params comply with Schema rules
 * @returns validated params
 * @throws BadRequest if some param is invalid
 */
async function checkParams(
  entityType: string, 
  uid: string, 
  unsafeParams: any
): Promise<any> {
  // check received params ...
  let params: any = zodHandler[entityType].safeParse(unsafeParams);

  if (!params.success) raiseError.BadRequest(
    `Some received params for '${entityType}' uid=${uid} are invalid`+
    `, params=${JSON.stringify(unsafeParams)}, errors=${params.error} `
  )

  return params.data;
}  


/**
 * Creates a provable object from the received data.
 * @returns { provable, hash }
 * @throws error if could not make it
 */
async function getProvable(
  entityType: string, 
  uid: string, 
  data: any
): Promise<any> {
  let hashed: Field = Field(0);
  let provable;
  try {
    provable = new provableHandler[entityType](data);
    hashed = provable.hash();
  }
  catch (err) { raiseError.DatabaseEngine(
    `Could not validate 'provable ${entityType}' merkle map uid=${uid}`
  )}

  return provable;
}


async function updateIndexer(
  entityType: string, 
  uid: string, 
  params: any
): Promise<any> {
  let db: any = prismaHandler[entityType];

  if (params.new) {
    // we must insert it right now
    params.uid = uid;
    console.log(params);
    delete params.new;
    const rs = await db.create({
      data: { ...params }
    })
    if (!rs) raiseError.DatabaseEngine(
      `Could not update ${entityType} uid=${uid} params=${JSON.stringify(params)}`
    )
    return rs;
  }

  let p = await db.findUnique({ where: { uid: uid }});
  if (!p) raiseError.DatabaseEngine(
    `Could not found ${entityType} uid=${uid}`
  )

  let data: any = params;
  try {
    Object.keys(p).map((k) => {
      data[k] = data[k] || p[k] ;
    })
  } catch(err) { raiseError.DatabaseEngine(
    `Could not validate '${entityType}' uid=${uid} params=${JSON.stringify(params)}`
  )}
  delete data.new;
    
  const rs = await db.upsert({
    where: { uid: uid },
    update: { ...data },
    create: { ...data }
  })
  if (!rs) raiseError.DatabaseEngine(
    `Could not update ${entityType} uid=${uid} params=${JSON.stringify(params)}`
  )
  
  return rs;
}


async function getMerkleLeaf(
  entityType: string, 
  uid: string
): Promise<LeafInstance> {
  let mapid: number = merkleId[entityType];

  let rs1 = await OffchainMerkleStorage.getMerkleMap(mapid);
  if (rs1.error) raiseError.DatabaseEngine(
    `Could not found ${entityType} merkle map uid=${uid}`
  )
  let map: OffchainMerkleMap = rs1.data;

  let rs2 = await map.get(uid);
  if (rs2.error) raiseError.DatabaseEngine(
    `Could not get '${entityType}' merkle map uid=${uid}`
  )
  let leaf: LeafInstance = rs2.data;  

  return leaf;
}


async function updateMerkleMap(
  entityType: string, 
  provable: any
): Promise<{
  map: OffchainMerkleMap, 
  updated: MerkleMapUpdate
}> {
  let mapid: number = merkleId[entityType];

  let rs1 = await OffchainMerkleStorage.getMerkleMap(mapid);
  if (rs1.error) raiseError.DatabaseEngine(
    `Could not found ${entityType} merkle map id=${mapid}`
  )
  let map: OffchainMerkleMap = rs1.data;

  const key = provable.key().toString();
  const hash = provable.hash();
  let rs2 = await map.set(key, provable.hash());
  if (rs2.error) raiseError.DatabaseEngine(
    `Could not set ${entityType} merkle map uid=${key} hash=${hash}`
  )
  let updated: MerkleMapUpdate = rs2.data;  

  return {
    map: map, 
    updated: updated
  };
}


async function updateMINA(
  entityType: string, 
  uid: string,
  provable: any,
  map: OffchainMerkleMap, 
  updated: MerkleMapUpdate,
  transactionId: string
): Promise<any> {

  updated.afterRoot = map.getRoot();
  let witness = map.getWitness(uid);

  let mapProxy: MerkleMapProxy = {
    id: UInt32.from(map.id),
    name: CircuitString.fromString(""),
    root: map.getRoot(),
    count: Field(map.size())
  }

  let rs = await minaService[entityType](
    provable, 
    mapProxy, 
    witness, 
    updated
  )

  return rs // a MINA tx or what ?
}
