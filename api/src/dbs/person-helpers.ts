import { Person } from "@prisma/client";
import { PersonSchema, PersonPartialSchema } from "../../prisma/generated/zod/index.js";
import { logger, prisma } from "../global.js";
import { raiseError } from "../responses.js"


export async function getPersonOrRaise(
  uid: string
): Promise<Person> {
  const p = await prisma.person.findUnique({
    where: { uid: uid }
  });
  if (!p) raiseError.NotFound(`Person %{uid} not found`);
  return p as Person;
}


export async function updatePersonOrRaise(
  uid: string, 
  unsafeParams: any
): Promise<Person> {
  let params: any = PersonPartialSchema.safeParse(unsafeParams);
  if (!params.success) 
    raiseError.BadRequest(params.error);

  const p = await prisma.person.update({
    where: { uid: uid },
    data: params.data,
  });
  if (!p) raiseError.DatabaseEngine(`Update person ${uid} failed`);
  return p as Person;
}
