import { SmartContract, state, State, method, Reducer, PublicKey } from "snarkyjs";
import { Field, Bool, Struct, Circuit, Poseidon } from "snarkyjs";
import { MerkleMapWitness } from "snarkyjs";

class Votes extends Struct({
  total: Field,
  positive: Field,
  negative: Field,
  ignored: Field
}){}

class VoteAction extends Struct({
  isValid: Bool,
  positive: Bool,
  negative: Bool,
  ignore: Bool,
}){}

export class NullifierProxy extends Struct({
  root: Field,
  witness: MerkleMapWitness
}) {
  static key(electorId: PublicKey, claimUid: Field): Field {
    Circuit.log(electorId, claimUid)
    const keyd = Poseidon.hash(
      electorId.toFields()
      .concat(claimUid.toFields())
    );
    Circuit.log("Key (",electorId, claimUid, ") =>", keyd)
    return keyd;
  } 
}

class VotingStatusEvent extends Struct({
  claimUid: Field,
  isFinished: Bool,
  hasChanged: Bool,
  result: Field,
  total: Field,
  positive: Field,
  negative: Field,
  ignored: Field
}) {}

// Voting states for an Elector on this Claim
const 
  UNASSIGNED = Field(0), // Claim not assigned to this elector
  ASSIGNED = Field(1),   // Claim assigned to elector but has not voted yet
  VOTED = Field(2);      // Claim assigned to elector and has already voted

// Final result states  
const 
  VOTING = Field(0),   // Claim is still in the voting process
  APPROVED = Field(1),
  REJECTED = Field(2),
  CANCELED = Field(3); // TODO: not sure how can we change this state ?


export class VotingContract extends SmartContract {
  // events to update Nullifier
  events = {
    'elector-has-voted': Field,
    'voting-changed': VotingStatusEvent
  };

  // the "reducer" field describes a type of action that we can dispatch, and reduce later
  reducer = Reducer({ actionType: VoteAction });

  // associated claim (referenced in Root contract on claimsRoots dataset)
  @state(Field) claimUid = State<Field>(); 

  // current voting status
  // total votes is the sum of this three
  @state(Field) positive = State<Field>(); 
  @state(Field) negative = State<Field>(); 
  @state(Field) ignored = State<Field>(); 

  // end conditions
  // if we have at least 'requiredVotes' the election is finished
  // if we have at least 'requiredPositive' votes the claim is approved
  @state(Field) requiredVotes = State<Field>(); 
  @state(Field) requiredPositives = State<Field>(); 

  // final result 0: Voting, 1: Approved, 2: Rejected
  @state(Field) result = State<Field>(); 

  // helper field to store the actual point in the actions history
  @state(Field) actionsState = State<Field>(); 

  init() {
    super.init();
    this.claimUid.set(Field(0));
    this.positive.set(Field(0));
    this.negative.set(Field(0)); 
    this.ignored.set(Field(0));
    this.requiredVotes.set(Field(0));
    this.requiredPositives.set(Field(0));
    this.result.set(Field(0));
    this.actionsState.set(Reducer.initialActionState); // TODO: is this the right way to initialize this ???
  }

  @method setup(
    claimUid: Field,
    requiredVotes: Field,
    requiredPositives: Field
  ) { 
    // we need to initialize a new claim with the correct params
    // but first need to be sure that it has never been setup before
    let uid = this.claimUid.getAndAssertEquals();
    let votes = this.requiredVotes.getAndAssertEquals();
    let positives = this.requiredPositives.getAndAssertEquals();
    // unless all three are 0 then they can not be changed
    // TODO: need to check if we need to manage additional permissions here!
    uid.assertEquals(Field(0));
    votes.assertEquals(Field(0));
    positives.assertEquals(Field(0));
    // assert that received values are ok
    // all Uids are allways > 0
    claimUid.assertGreaterThan(Field(0), "Invalid claimUid"); 
    // positives and votes must be at least >= 1
    requiredVotes.assertGreaterThanOrEqual(Field(1), "Required votes must be >= 1")
    requiredPositives.assertGreaterThanOrEqual(Field(1), "Required positives must be >= 1")
    // votes > positives or votes == positives are valid
    // NOTE that votes == positives means unanimity voting
    requiredVotes.assertGreaterThanOrEqual(requiredPositives, "Required votes must be >= required positives"); 
    // now we can do it !
    this.claimUid.set(claimUid);
    this.requiredVotes.set(requiredVotes);
    this.requiredPositives.set(requiredPositives);
  }


  @method assertHasNotVoted(
    electorPuk: PublicKey,
    claimUid: Field,
    nullifier: NullifierProxy
  ) {
    // compute a root and key from the given Witness using the only valid 
    // value ASSIGNED, other values indicate that the elector was 
    // never assigned to this claim or that he has already voted on it
    const [witnessRoot, witnessKey] = nullifier.witness.computeRootAndKey(
      ASSIGNED /* WAS ASSIGNED BUT NOT VOTED YET */
    );
    Circuit.log("assertHasNotVoted witnessRoot", witnessRoot);
    Circuit.log("assertHasNotVoted witnessKey", witnessKey);

    // check the witness obtained root matchs the Nullifier root
    nullifier.root.assertEquals(witnessRoot, 
      "Invalid elector root or already voted") ;

    // check the witness obtained key matchs the elector+claim key 
    const key: Field = NullifierProxy.key(electorPuk, claimUid);
    Circuit.log("assertHasNotVoted recalculated Key", key);

    witnessKey.assertEquals(key, 
      "Invalid elector key or already voted");
  }


  @method confirmTaskDone(
    vote: Field, // +1 positive, -1 negative or 0 ignored
    nullifier: NullifierProxy
  ) {
    const claimUid = this.claimUid.get();
    this.claimUid.assertEquals(claimUid);
    Circuit.log("sendVote claimUid=", claimUid);
    
    // the elector Pub key is the one sending the Tx
    let electorPuk = this.sender;
    electorPuk.assertEquals(this.sender);
    
    // check this elector was assigned AND has not voted on this claim before
    Circuit.log("sendVote key=", NullifierProxy.key(electorPuk, claimUid));
    this.assertHasNotVoted(electorPuk, claimUid, nullifier);

    // get current votes state
    let positives = this.positive.getAndAssertEquals();
    let negatives = this.negative.getAndAssertEquals();
    let ignored = this.ignored.getAndAssertEquals();
    let votes = Field(0).add(positives).add(negatives).add(ignored);

    // get current end conditions
    let requiredVotes = this.requiredVotes.getAndAssertEquals();
    
    // check that we have not already finished 
    // and that we can receive additional votes
    votes.lessThanOrEqual(requiredVotes);

    // dispatch action
    const action: VoteAction = { 
      isValid: Bool(true),
      positive: Circuit.if(vote.greaterThan(0), Bool(true), Bool(false)),
      negative: Circuit.if(vote.lessThan(0), Bool(true), Bool(false)),
      ignore: Circuit.if(vote.equals(0), Bool(true), Bool(false))
    };
    this.reducer.dispatch(action);  
    Circuit.log("dispatched action", action);

    // send event to change this elector state in Nullifier
    let key: Field = NullifierProxy.key(electorPuk, claimUid);
    this.emitEvent("elector-has-voted", key);
  }


  @method rollupVotes() {
    const claimUid = this.claimUid.get();
    this.claimUid.assertEquals(claimUid);

    // check that this claim is still open (in the voting process)
    const currentResult = this.result.get();
    this.result.assertEquals(currentResult);
    currentResult.assertEquals(VOTING, /*ELSE*/"Voting has already finished !");

    // get current votes state
    let positives = this.positive.getAndAssertEquals();
    let negatives = this.negative.getAndAssertEquals();
    let ignored = this.ignored.getAndAssertEquals();
    let votes = Field(0).add(positives).add(negatives).add(ignored);

    // get current ending conditions
    let requiredVotes = this.requiredVotes.getAndAssertEquals();
    let requiredPositives = this.requiredPositives.getAndAssertEquals();
    
    // check that we have not already finished 
    // and that we can receive additional votes
    votes.assertLessThan(requiredVotes, "Too late, voting has already finished !");
    Circuit.log("rollupVotes votes required,total=", requiredVotes, votes);

    // get the point in history where we left the last rollup
    let actionsState = this.actionsState.get();
    this.actionsState.assertEquals(actionsState);
    Circuit.log("rollupVotes actionsState=", actionsState);
    
    // get all votes not counted since last rollup
    let pendingVotes = this.reducer.getActions({
      fromActionState: actionsState,
    });
    Circuit.log("rollupVotes pendingVotes.length=", pendingVotes.length);

    // build Voting initial state for Reducer
    let votingState: Votes = {
      total: votes,
      positive: positives,
      negative: negatives,
      ignored: ignored,
    };

    let { 
      state: newVotes, 
      actionState: newActionsState 
    } = this.reducer.reduce(
      pendingVotes, // pending votes to reduce
      Votes,        // the state type
      function (    // function that says how to apply the action
        state: Votes, 
        action: VoteAction
      ) {
        // we can use a reducer here because it is not important if votes arrive 
        // in different order than the one they were emited. we just need more
        // than the total required votes to be done
        Circuit.log("---");
        Circuit.log("reducer action=", action);
        Circuit.log("reducer before state=", state);
        const notFinished = state.total.lessThan(requiredVotes);
        const mustCount = notFinished.and(action.isValid);
        Circuit.log("reducer notFinished=", notFinished, "isValid=", action.isValid, " mustCount=", mustCount);
        state.total = Circuit.if(mustCount, state.total.add(1), state.total);
        state.positive = Circuit.if(mustCount.and(action.positive), state.positive.add(1), state.positive);
        state.negative = Circuit.if(mustCount.and(action.negative), state.negative.add(1), state.negative);
        state.ignored = Circuit.if(mustCount.and(action.ignore), state.ignored.add(1), state.ignored);
        Circuit.log("reducer after state=", state);
        return state;
      },
      { state: votingState, actionState: actionsState } // initial state and actions point
    );
    Circuit.log("reducer final state=", newVotes);

    // update on-chain voting and actions state
    this.actionsState.set(newActionsState);
    this.positive.set(newVotes.positive);
    this.negative.set(newVotes.negative);
    this.ignored.set(newVotes.ignored);

    // check if we have met end voting conditions
    let isFinished = newVotes.total.greaterThanOrEqual(requiredVotes);
    let isApproved = newVotes.positive.greaterThanOrEqual(requiredPositives);
         
    // assert result before changing its value
    let result = this.result.get();
    this.result.assertEquals(result);

    // now evaluate final result
    let newResult = Circuit.if(isFinished, 
      Circuit.if(isApproved, APPROVED, REJECTED),
      result
    );

    // update final on-chain result state
    this.result.set(newResult);

    // check if it has changed so we can report it with the event
    let resultHasChanged = newResult.greaterThan(result);

    // and send event with actual result, even if it is not yet finished
    // TODO: can we use an if condition here? I think it cant be done
    this.emitEvent("voting-changed", {
      claimUid: claimUid,
      isFinished: isFinished,
      hasChanged: resultHasChanged,
      result: result,
      total: newVotes.total,
      positive: newVotes.positive,
      negative: newVotes.negative,
      ignored: newVotes.ignored
    });

    Circuit.log("rollupClaims result=", newResult);
    Circuit.log("rollupClaims isFinished=", isFinished);
    Circuit.log("rollupClaims isApproved=", isApproved);
  }
}
