import { UID } from "@socialcap/contracts";
//import { CLAIMED, WAITING, UNPAID, VOTING } from "@socialcap/contracts";
import { fastify, prisma, logger } from "../global.js";
import { hasError, hasResult, raiseError } from "../responses.js";
// import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";


export async function getCredential(params: any) {
  let uid = params.uid;
  
  //let data = await getEntity("credential", uid);
  let data = await prisma.credential.findUnique({ 
    where: { uid: uid }
  });
  if (!data) raiseError.DatabaseEngine(
    `Could not found Credential uid=${uid}`
  )

  return hasResult(data); 
}

export async function getMyCredentials(params: any) {
  const userUid = params.user.uid;
  const communityUid: string | undefined = params.communityUid;

  // all commnunity Uids where is a a member
  const credentials = await prisma.credential.findMany({
    where: { applicantUid: userUid, uid: communityUid  },
    orderBy: { issuedUTC: 'desc' }
  })
  if (! credentials) 
    return hasResult([]);

  return hasResult(credentials);
}


///// MOCKUPS /////
const aCredentialMockup = {
  uid: "caaaaff63a48400a9ce57f3ad6960001",
  // the MINA account where this credential "lives"
  accountId: "B62x...01234", //
  // this are the other related MINA account ids
  applicantId: "B62qixo7ZaNjibjRh3dhU1rNLVzNUqDtgwyUB6n9xxYFrHEHmfJXbBf",
  claimId: "B62qoNJskZVfQVwf7jQ2vohCV1TzBgzaeTs1sayYb1ZDq6weLwV5CXP",
  // the source references (redundant by useful for querying)
  applicantUid: "ec3c6e254d0b42debd939d9a7bd7cacc",
  communityUid: "70ed0f69af174c399b1958c01dc191c0",
  claimUid: "fc2f96d6214b4b5696bf3a00eed12215",
  // type & description data
  type: "Community Active Help", // String?   @default("")
  description: "Rewarding those who helped others in a distingished form",//  String?   @default("")
  community: "My first DAO", // String? @default("")
  image: "bafybeig22bhtszvqbmenyekv7qb55hjqehriz6wmx7unsqygjieqxsc6dy", // String?   @default("")
  alias: "Manza", // String?   @default("")
  stars: 5, //Int?      @default(0)
  metadata: {}, // String?   @default("{}")
  revocable: false,
  issuedUTC: "2023-08-01T15:00:00.000Z", //    DateTime? @map("issued_utc")
  expiresUTC: "2023-08-01T15:00:00.000Z" //   DateTime? @map("expires _utc")
}
