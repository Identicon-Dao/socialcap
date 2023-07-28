import { Community } from "@prisma/client";
import { CommunitySchema, CommunityPartialSchema } from "../../prisma/generated/zod/index.js";
// import { CommunityState } from "@socialcap/contracts";
import { logger, prisma } from "../global.js";
import { raiseError } from "../responses.js"
import { getPersonOrRaise } from "./person-helpers.js";


export async function getCommunityOrRaise(
  uid: string
): Promise<Community> {
  const t = await prisma.community.findUnique({
    where: { uid: uid }
  });
  if (!t) raiseError.NotFound(`Community %{uid} not found`);
  return t as Community;
}


export async function updateCommunityOrRaise(
  uid: string, 
  unsafeParams: any
): Promise<Community> {
  let params: any = CommunityPartialSchema.safeParse(unsafeParams);

  // we mostly allways need this
  let current = await prisma.community.findUnique({
    where: { uid: uid }
  });
  
  // if (params.state) {
  //   // needs additional checking here, suchs as valid state
  //   //params.state = CommunityState.changeFrom(current?.state || "", params.state);
  // }

  if (params.adminUid) {
    // we must check the adminUid for a valid PersonUid 
    const admin = await getPersonOrRaise(params.adminUid);
  }

  const upserted = await prisma.community.upsert({
    where: { uid: uid },
    update: {
      ...params
    },
    create: { 
      uid: uid, 
      name: params.name || "Yet unnamed!", 
      description: params.description || "Please describe this community",
      state: "INITIAL",
      adminUid: params.adminUid as string
    },
  })

  return upserted;
}


async function getMyCommunities(userUid: string) {
  
}