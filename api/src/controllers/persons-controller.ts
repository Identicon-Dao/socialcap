import { fastify, prisma } from "../global.js";
import { UID, PersonState } from "@socialcap/contracts"
import { i18n as _ } from "../i18n/messages.js";
import { hasError, hasResult } from "../responses.js";
import { updateEntity, getEntity } from "../dbs/any-entity-helpers.js";


/**
 * signUp
 * Starts the onboarding process for a new user.
 * @param params Object: { email, ... }
 * @returns MutationResult
 */
export async function signUp(params: {
  full_name: string;
  email: string;
  phone?: string;
  telegram?: string;
}) {
  // 1. If no email/full_name/account_id => Error BAD_REQUEST (incomplete params)
  if (!params.email)
    return hasError.MissingParams(_.missing_param("email", "sign_up"));
  if (!params.full_name)
    return hasError.MissingParams(_.missing_param("full_name", "sign_up"));

  // 2. If received email exists in `persons` table => Error CONFLICT (already exists)
  const noPerson = await prisma.person.findUnique({
    where: { email: params.email },
  });
  if (noPerson !== null)
    return hasError.Conflict(_.persons_already_registered(params.email));

  // 3. Create default values for fields 'avatar' and 'preferences'
  const defaultPrefs = "{}";

  // 4. Insert into `personas(email, state:PENDING, ...params)`
  const person = await prisma.person.create({
    data: {
      uid: UID.uuid4(),
      accountId: "",
      state: PersonState.initial(),
      fullName: params.full_name,
      email: params.email,
      phone: params.phone || "",
      telegram: params.telegram || "",
      preferences: defaultPrefs,
    },
  });
  if (!person)
    return hasError.DatabaseEngine(_.database_error("insert into table Persons"));

  console.log(`sign_up params=`, params);
  console.log(`sign_up result=`, person);

  // 5. Add to ProvablePerson MerkleMap and updatePerson() on RootContract ...
  // this is just a Promise call and we do not wait for response !!!
  // updateProvablePerson(person);

  // 7. Return the fully created Person data
  return hasResult(person);
}


export async function getProfile(params: any) {
  const uid = params.user.uid; // received from the JWT token
  const person = await getEntity("person", uid);
  return hasResult(person); 
}


export async function updateProfile(params: any) {
  const uid = params.uid;

  let rs = await updateEntity("person", uid, params);

  return hasResult({
    profile: rs.proved,
    transaction: rs.transaction
  }); 
}
