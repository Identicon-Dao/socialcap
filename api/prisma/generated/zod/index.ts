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

export const CommunityScalarFieldEnumSchema = z.enum(['uid','accountId','adminUid','state','name','description','image','createdUTC','updatedUTC','approvedUTC']);

export const MembersScalarFieldEnumSchema = z.enum(['uid','communityUid','personUid','role','createdUTC','approvedUTC']);

export const ClaimScalarFieldEnumSchema = z.enum(['uid','communityUid','applicantUid','planUid','state','accountId','alias','createdUTC','updatedUTC','votedUTC','issuedUTC','dueUTC','requiredVotes','requiredPositives','positiveVotes','negativeVotes','ignoredVotes','evidenceData']);

export const PlanScalarFieldEnumSchema = z.enum(['uid','communityUid','state','name','alias','description','image','template','evidence','strategy','createdUTC','updatedUTC','approvedUTC','fee','rewardsShare','communityShare','protocolShare','total','available','expiration','revocable','startsUTC','endsUTC']);

export const CredentialScalarFieldEnumSchema = z.enum(['uid','communityUid','claimId','applicantId','type','description','image','alias','starts','metadata','issuedUTC','expiresUTC']);

export const TaskScalarFieldEnumSchema = z.enum(['uid','claimUid','assigneeUid','state','assignedUTC','completedUTC','dueUTC','rewarded','reason']);

export const ProposedScalarFieldEnumSchema = z.enum(['uid','role','personUid','communityUid','createdUTC']);

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
  accountId: z.string().max(32).nullish(),
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
  accountId: z.string().max(32).nullish(),
  adminUid: z.string().max(32),
  state: z.string().min(1).max(12),
  name: z.string().min(3).max(128),
  description: z.string().max(128).nullish(),
  image: z.string().url().max(128).nullish(),
  createdUTC: z.coerce.date(),
  updatedUTC: z.coerce.date(),
  approvedUTC: z.coerce.date().nullish(),
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
  communityUid: z.string(),
  claimId: z.string(),
  applicantId: z.string(),
  type: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  alias: z.string().nullish(),
  starts: z.number().int().nullish(),
  metadata: z.string().nullish(),
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
