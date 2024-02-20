<div class="d-flex align-items-left p-3">
  <MasterPlanSelector bind:value={selectedPlanUid} label="Master Plan" options={plans.map(p=> ({ value: p.uid, text:
    p.name}))} placeholder="Select a Master Plan" />
</div>

{#if (selectedPlanUid)}
  <Section class="section-lg mt-4">
    <Steps {steps} current={currentStep} clickable={false}/>
  </Section>

  <Section class="section-lg mt-4">
    {#if (currentStep === 0)} 
      <RunButton 
        run={stopClaims}
        class="me-4"
        label="Stop claimings !"
        alt="Stopping the claiming. Please wait ..."
      />
    {/if}

    {#if (currentStep === 1)} 
      <RunButton 
         run={assignTheElectors}
         class="me-4"
         label="Assign electors !"
         alt="Assigning the electors ... This will take some time <br>Please wait." 
      />
    {/if}

    {#if (currentStep === 2)}
      <Alert color="info">     
        Voting in progress
      </Alert>
      <RunButton 
        run={stopVoting}
        class="me-4"
        label="Close Voting !"
        alt="Closing voting. Please wait ..."
      /> 
    {/if}

    {#if (currentStep === 3)}
      <RunButtonGroup 
        class="me-4"
        buttons={[
          {
            label: "< Reopen Voting",
            alt: "Reopening the voting. Please wait ...",
            run: reopenVoting
          },
          {
            label: "Start Tally !",
            alt: "Starting counting votes. Please wait ...",
            run: startTallying
          },
          {
            label: "Close Tally >",
            alt: "Closing the counting. Please wait ...",
            run: stopTallying
          }
        ]}
      /> 
      {#if (tallyed)} 
        <Alert color="info" class="mt-4">
          Processed 
            batches={tallyed.batchesCount} 
            claims={tallyed.claimsCount} 
            votes={tallyed.votesCount}
        </Alert>
      {/if}
    {/if}

    {#if (currentStep === 4)}
      <RunButton 
        run={runIssueCredentials}
        class="me-4"
        label="Issue Credentials"
        alt="Issuing credentials ... this will take some time ! <br>Please wait"
      /> 
    {/if}
  </Section>
{/if}

<script>
    import { onMount } from "svelte";
    import { Icon } from "sveltestrap";
    import { FormGroup, Label, Input, FormText, Button, Alert } from "sveltestrap";
    import Section from "@components/Section.svelte";
    import RunButton from "@components/buttons/RunButton.svelte";
    import RunButtonGroup from "@components/buttons/RunButtonGroup.svelte";
    import { NONE, ACTIVE, VOTING, DONE, CLAIMED, TALLYING } from "@models/states";
    import { Steps } from 'svelte-steps';
    import MasterPlanSelector from "@components/MasterPlanSelector.svelte";
    import { getPlan } from "@apis/queries";
    import { stopClaimings, enableVoting, reassignElectors, closeVoting, reopenVoting, startTally, closeTally, issueCredentials } from "@apis/mutations";

    export let communityUid, startsUTC, endsUTC, judges, adminUid, xadmins, plans, members;
    
    let selectedPlanUid = undefined, state = undefined, currentStep;
    let tallyed = null;

    let steps = [
        { text: 'Claiming', icon: Icon, iconProps: {name: "envelope-plus-fill"} },
        { text: 'Assigning', icon: Icon, iconProps: {name: "people-fill"}},
        { text: 'Voting', icon: Icon, iconProps: {name: "envelope-paper-fill"}},
        { text: 'Tallying', icon: Icon, iconProps: {name: "box-seam-fill"} },
        { text: 'Issuing', icon: Icon, iconProps: {name: "person-circle"} }
    ];

    $: {
      state = getPlanState(selectedPlanUid);
      currentStep = getCurrentStep(state);
    }

    async function getUpdatedPlanState(uid) {
      let plan = await getPlan(uid);
      for (let j=0; j < plans.length; j++) {
        let p = plans[j];
        if (p.uid === selectedPlanUid) 
          plans[j] = plan;
      }     
      return getPlanState(selectedPlanUid);
    }

    async function stopClaims() {
      console.log("starting vote")
      let uPlan = await stopClaimings(selectedPlanUid);
      state = await getUpdatedPlanState(selectedPlanUid)
    }

    async function assignTheElectors() {
      console.log("starting vote")
      let uPlan = await enableVoting(selectedPlanUid);
      state = await getUpdatedPlanState(selectedPlanUid)
      console.log("started")
    }

    async function stopVoting() {
      let uPlan = await closeVoting(selectedPlanUid);
      state = await getUpdatedPlanState(selectedPlanUid)
    }

    async function startTallying() {
      let done = await startTally(selectedPlanUid);
      tallyed = done.processed;
      state = await getUpdatedPlanState(selectedPlanUid)
    }

    async function stopTallying() {
      let uPlan = await closeTally(selectedPlanUid);
      state = await getUpdatedPlanState(selectedPlanUid)
    }

    async function runIssueCredentials() {
      let uPlan = await issueCredentials(selectedPlanUid)
    }
    
    function getCurrentStep(state) {
      if (!state)
        return 0;

      if (state === ACTIVE)
        return 0; // still Claiming ...

      if (state === CLAIMED)
        return 1; // can Assign judges now

      if (state === VOTING)
        return 2; // Voting

      if (state === TALLYING)
        return 3; // Cab count votes

      if (state === DONE)
        return 4; // issue credentials
    }

    function getPlanState(selectedPlanUid) {
      console.log("plans",plans)
      return selectedPlanUid 
        ? plans.filter(p => p.uid === selectedPlanUid)[0].state 
        : NONE;
    }
</script>