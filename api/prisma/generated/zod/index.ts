import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const MerkleMapScalarFieldEnumSchema = z.enum(['id','name','root','size','height','createdUtc','updatedUtc']);

export const MerkleMapLeafScalarFieldEnumSchema = z.enum(['uid','mapId','index','key','hash','data','createdUtc','updatedUtc']);

export const SessionScalarFieldEnumSchema = z.enum(['uid','otp','email','createdUtc','updatedUtc']);

export const PersonScalarFieldEnumSchema = z.enum(['uid','accountId','state','fullName','description','image','email','phone','telegram','preferences','createdUTC','updatedUTC','approvedUTC']);

export const CommunityScalarFieldEnumSchema = z.enum(['uid','accountId','adminUid','state','name','description','image','createdUTC','updatedUTC','approvedUTC','xadmins']);

export const MembersScalarFieldEnumSchema = z.enum(['uid','communityUid','personUid','role','createdUTC','approvedUTC']);

export const ClaimScalarFieldEnumSchema = z.enum(['uid','communityUid','applicantUid','planUid','state','accountId','alias','createdUTC','updatedUTC','votedUTC','issuedUTC','dueUTC','requiredVotes','requiredPositives','positiveVotes','negativeVotes','ignoredVotes','evidenceData']);

export const PlanScalarFieldEnumSchema = z.enum(['uid','communityUid','state','name','alias','description','image','template','evidence','strategy','createdUTC','updatedUTC','approvedUTC','fee','rewardsShare','communityShare','protocolShare','total','available','expiration','revocable','startsUTC','endsUTC']);

export const CredentialScalarFieldEnumSchema = z.enum(['uid','accountId','applicantId','claimId','applicantUid','communityUid','claimUid','type','description','community','image','alias','stars','metadata','revocable','issuedUTC','expiresUTC']);

export const TaskScalarFieldEnumSchema = z.enum(['uid','claimUid','assigneeUid','state','assignedUTC','completedUTC','dueUTC','rewarded','reason','result']);

export const ProposedScalarFieldEnumSchema = z.enum(['uid','role','personUid','communityUid','createdUTC']);

export const BatchScalarFieldEnumSchema = z.enum(['uid','sequence','type','metadata','signerAccountId','signedData','signatureField','signatureScalar','commitment','size','state','submitedUTC','doneUTC']);

export const StateScalarFieldEnumSchema = z.enum(['id','label']);

export const TransactionQueueScalarFieldEnumSchema = z.enum(['uid','sequence','queue','type','data','state','receivedUTC','submitedUTC','doneUTC','retries','MinaTxId','MinaTxStatus']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);

export const NullsOrderSchema = z.enum(['first','last']);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// MERKLE MAP SCHEMA
/////////////////////////////////////////

export const MerkleMapSchema = z.object({
  id: z.number().int(),
  name: z.string(),
  root: z.bigint(),
  size: z.number().int(),
  height: z.number().int(),
  createdUtc: z.coerce.date(),
  updatedUtc: z.coerce.date(),
})

export type MerkleMap = z.infer<typeof MerkleMapSchema>

/////////////////////////////////////////
// MERKLE MAP PARTIAL SCHEMA
/////////////////////////////////////////

export const MerkleMapPartialSchema = MerkleMapSchema.partial()

export type MerkleMapPartial = z.infer<typeof MerkleMapPartialSchema>

/////////////////////////////////////////
// MERKLE MAP LEAF SCHEMA
/////////////////////////////////////////

export const MerkleMapLeafSchema = z.object({
  uid: z.string().uuid(),
  mapId: z.number().int(),
  index: z.bigint(),
  key: z.string(),
  hash: z.string(),
  data: z.string().nullish(),
  createdUtc: z.coerce.date(),
  updatedUtc: z.coerce.date(),
})

export type MerkleMapLeaf = z.infer<typeof MerkleMapLeafSchema>

/////////////////////////////////////////
// MERKLE MAP LEAF PARTIAL SCHEMA
/////////////////////////////////////////

export const MerkleMapLeafPartialSchema = MerkleMapLeafSchema.partial()

export type MerkleMapLeafPartial = z.infer<typeof MerkleMapLeafPartialSchema>

/////////////////////////////////////////
// SESSION SCHEMA
/////////////////////////////////////////

export const SessionSchema = z.object({
  uid: z.string().max(36),
  otp: z.string().min(6).max(8),
  email: z.string().email().min(5).max(128),
  createdUtc: z.coerce.date(),
  updatedUtc: z.coerce.date(),
})

export type Session = z.infer<typeof SessionSchema>

/////////////////////////////////////////
// SESSION PARTIAL SCHEMA
/////////////////////////////////////////

export const SessionPartialSchema = SessionSchema.partial()

export type SessionPartial = z.infer<typeof SessionPartialSchema>

/////////////////////////////////////////
// PERSON SCHEMA
/////////////////////////////////////////

export const PersonSchema = z.object({
  uid: z.string().max(32),
  accountId: z.string().max(64).nullish(),
  state: z.string().min(1).max(12),
  fullName: z.string().min(3).max(128),
  description: z.string().max(128).nullish(),
  image: z.string().max(128).nullish(),
  email: z.string().email().min(5).max(128),
  phone: z.string().max(128).nullish(),
  telegram: z.string().max(128).nullish(),
  preferences: z.string().nullish(),
  createdUTC: z.coerce.date(),
  updatedUTC: z.coerce.date().nullish(),
  approvedUTC: z.coerce.date().nullish(),
})

export type Person = z.infer<typeof PersonSchema>

/////////////////////////////////////////
// PERSON PARTIAL SCHEMA
/////////////////////////////////////////

export const PersonPartialSchema = PersonSchema.partial()

export type PersonPartial = z.infer<typeof PersonPartialSchema>

/////////////////////////////////////////
// COMMUNITY SCHEMA
/////////////////////////////////////////

export const CommunitySchema = z.object({
  uid: z.string().max(32),
  accountId: z.string().max(64).nullish(),
  adminUid: z.string().max(64),
  state: z.string().min(1).max(12),
  name: z.string().min(3).max(128),
  description: z.string().max(128).nullish(),
  image: z.string().url().max(1024).nullish(),
  createdUTC: z.coerce.date(),
  updatedUTC: z.coerce.date(),
  approvedUTC: z.coerce.date().nullish(),
  xadmins: z.string().nullish(),
})

export type Community = z.infer<typeof CommunitySchema>

/////////////////////////////////////////
// COMMUNITY PARTIAL SCHEMA
/////////////////////////////////////////

export const CommunityPartialSchema = CommunitySchema.partial()

export type CommunityPartial = z.infer<typeof CommunityPartialSchema>

/////////////////////////////////////////
// MEMBERS SCHEMA
/////////////////////////////////////////

export const MembersSchema = z.object({
  uid: z.string(),
  communityUid: z.string().max(32),
  personUid: z.string().max(32),
  /**
   * // 1:PLAIN, 2:VALIDATOR, 3:AUDITOR
   */
  role: z.string().max(32),
  createdUTC: z.coerce.date(),
  approvedUTC: z.coerce.date().nullish(),
})

export type Members = z.infer<typeof MembersSchema>

/////////////////////////////////////////
// MEMBERS PARTIAL SCHEMA
/////////////////////////////////////////

export const MembersPartialSchema = MembersSchema.partial()

export type MembersPartial = z.infer<typeof MembersPartialSchema>

/////////////////////////////////////////
// CLAIM SCHEMA
/////////////////////////////////////////

export const ClaimSchema = z.object({
  uid: z.string(),
  communityUid: z.string(),
  applicantUid: z.string(),
  planUid: z.string(),
  state: z.number().int(),
  accountId: z.string().nullish(),
  alias: z.string().nullish(),
  createdUTC: z.coerce.date(),
  updatedUTC: z.coerce.date(),
  votedUTC: z.coerce.date().nullish(),
  issuedUTC: z.coerce.date().nullish(),
  dueUTC: z.coerce.date().nullish(),
  requiredVotes: z.number().int().nullish(),
  requiredPositives: z.number().int().nullish(),
  positiveVotes: z.number().int().nullish(),
  negativeVotes: z.number().int().nullish(),
  ignoredVotes: z.number().int().nullish(),
  evidenceData: z.string().nullish(),
})

export type Claim = z.infer<typeof ClaimSchema>

/////////////////////////////////////////
// CLAIM PARTIAL SCHEMA
/////////////////////////////////////////

export const ClaimPartialSchema = ClaimSchema.partial()

export type ClaimPartial = z.infer<typeof ClaimPartialSchema>

/////////////////////////////////////////
// PLAN SCHEMA
/////////////////////////////////////////

export const PlanSchema = z.object({
  uid: z.string(),
  communityUid: z.string(),
  state: z.number().int(),
  name: z.string(),
  alias: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  template: z.string().nullish(),
  evidence: z.string().nullish(),
  strategy: z.string().nullish(),
  createdUTC: z.coerce.date(),
  updatedUTC: z.coerce.date(),
  approvedUTC: z.coerce.date().nullish(),
  fee: z.number().int().nullish(),
  rewardsShare: z.number().int().nullish(),
  communityShare: z.number().int().nullish(),
  protocolShare: z.number().int().nullish(),
  total: z.number().int().nullish(),
  available: z.number().int().nullish(),
  expiration: z.number().int().nullish(),
  revocable: z.boolean().nullish(),
  startsUTC: z.coerce.date().nullish(),
  endsUTC: z.coerce.date().nullish(),
})

export type Plan = z.infer<typeof PlanSchema>

/////////////////////////////////////////
// PLAN PARTIAL SCHEMA
/////////////////////////////////////////

export const PlanPartialSchema = PlanSchema.partial()

export type PlanPartial = z.infer<typeof PlanPartialSchema>

/////////////////////////////////////////
// CREDENTIAL SCHEMA
/////////////////////////////////////////

export const CredentialSchema = z.object({
  uid: z.string(),
  accountId: z.string(),
  applicantId: z.string(),
  claimId: z.string(),
  applicantUid: z.string(),
  communityUid: z.string(),
  claimUid: z.string(),
  type: z.string().nullish(),
  description: z.string().nullish(),
  community: z.string().nullish(),
  image: z.string().nullish(),
  alias: z.string().nullish(),
  stars: z.number().int().nullish(),
  metadata: z.string().nullish(),
  revocable: z.boolean().nullish(),
  issuedUTC: z.coerce.date().nullish(),
  expiresUTC: z.coerce.date().nullish(),
})

export type Credential = z.infer<typeof CredentialSchema>

/////////////////////////////////////////
// CREDENTIAL PARTIAL SCHEMA
/////////////////////////////////////////

export const CredentialPartialSchema = CredentialSchema.partial()

export type CredentialPartial = z.infer<typeof CredentialPartialSchema>

/////////////////////////////////////////
// TASK SCHEMA
/////////////////////////////////////////

export const TaskSchema = z.object({
  uid: z.string(),
  claimUid: z.string(),
  assigneeUid: z.string(),
  state: z.number().int(),
  assignedUTC: z.coerce.date().nullish(),
  completedUTC: z.coerce.date().nullish(),
  dueUTC: z.coerce.date().nullish(),
  rewarded: z.number().int().nullish(),
  reason: z.number().int().nullish(),
  result: z.string().nullish(),
})

export type Task = z.infer<typeof TaskSchema>

/////////////////////////////////////////
// TASK PARTIAL SCHEMA
/////////////////////////////////////////

export const TaskPartialSchema = TaskSchema.partial()

export type TaskPartial = z.infer<typeof TaskPartialSchema>

/////////////////////////////////////////
// PROPOSED SCHEMA
/////////////////////////////////////////

export const ProposedSchema = z.object({
  uid: z.string(),
  role: z.string(),
  personUid: z.string(),
  communityUid: z.string(),
  createdUTC: z.coerce.date(),
})

export type Proposed = z.infer<typeof ProposedSchema>

/////////////////////////////////////////
// PROPOSED PARTIAL SCHEMA
/////////////////////////////////////////

export const ProposedPartialSchema = ProposedSchema.partial()

export type ProposedPartial = z.infer<typeof ProposedPartialSchema>

/////////////////////////////////////////
// BATCH SCHEMA
/////////////////////////////////////////

export const BatchSchema = z.object({
  uid: z.string(),
  sequence: z.number().int(),
  type: z.string(),
  metadata: z.string(),
  signerAccountId: z.string(),
  signedData: z.string(),
  signatureField: z.string(),
  signatureScalar: z.string(),
  commitment: z.string(),
  size: z.number().int(),
  state: z.number().int(),
  submitedUTC: z.coerce.date(),
  doneUTC: z.coerce.date().nullish(),
})

export type Batch = z.infer<typeof BatchSchema>

/////////////////////////////////////////
// BATCH PARTIAL SCHEMA
/////////////////////////////////////////

export const BatchPartialSchema = BatchSchema.partial()

export type BatchPartial = z.infer<typeof BatchPartialSchema>

/////////////////////////////////////////
// STATE SCHEMA
/////////////////////////////////////////

export const StateSchema = z.object({
  id: z.number().int(),
  label: z.string(),
})

export type State = z.infer<typeof StateSchema>

/////////////////////////////////////////
// STATE PARTIAL SCHEMA
/////////////////////////////////////////

export const StatePartialSchema = StateSchema.partial()

export type StatePartial = z.infer<typeof StatePartialSchema>

/////////////////////////////////////////
// TRANSACTION QUEUE SCHEMA
/////////////////////////////////////////

export const TransactionQueueSchema = z.object({
  uid: z.string(),
  sequence: z.number().int().nullish(),
  queue: z.string(),
  type: z.string(),
  data: z.string(),
  state: z.number().int().nullish(),
  receivedUTC: z.coerce.date(),
  submitedUTC: z.coerce.date().nullish(),
  doneUTC: z.coerce.date().nullish(),
  retries: z.number().int().nullish(),
  MinaTxId: z.string().nullish(),
  MinaTxStatus: z.string().nullish(),
})

export type TransactionQueue = z.infer<typeof TransactionQueueSchema>

/////////////////////////////////////////
// TRANSACTION QUEUE PARTIAL SCHEMA
/////////////////////////////////////////

export const TransactionQueuePartialSchema = TransactionQueueSchema.partial()

export type TransactionQueuePartial = z.infer<typeof TransactionQueuePartialSchema>
