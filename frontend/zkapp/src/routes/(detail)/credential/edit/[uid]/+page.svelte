<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: `Claim your credential`}
]}/>
{#if !plan || !claim || !community}
  <span>Loading...</span>
{:else}
<DetailPageContent>
  <!-- <Sidenote>
    <hr/>
    <p>::: USER CAN CLAIM A CREDENTIAL OF SOME COMMUNITY WHERE HE/SHE IS A MEMBER :::</p>
    <p>This is a form where he will claim a new credential, and this form is controlled by the MasterPlan.</p>
    <p>We only arrive here if the user already is a member of at least one community.</p>
  </Sidenote> -->
  <Section class="section-md border-2 rounded-2 p-4 shadow">
    <div class="d-flex align-items-center justify-content-between pt-4">
      <div class="w-25 me-4 pe-2 rounded-2">
        <img 
          src={plan.image} crossorigin 
          alt="Badge" 
          width="22.5%" 
          style="min-width:120px;min-height:120px;max-width:120px;" 
          class="img-thumbnail rounded-4 me-2 mt-2" 
          />
      </div>

      <div class="w-100 ps-2">
        <h3 class="text-black d-flex justify-content-between align-items-center">
          <span>{plan.name}</span>
          <span class="fs-5">
            <StateBadge state={claim.state} />
          </span>
        </h3>

        <p class="fs-sm text-secondary lh-lg text-start">
          {@html plan.description}
          <br><b>{community.name}</b>
        </p>

        <div class="d-flex justify-content-start">
          <p class="">
            <span class="fs-xs">Start Date</span>
            <br/><b class="fs-sm">{showUTCDatetime(plan.startsUTC)} UTC</b>
          </p>
          <p class="px-5">
            <span class="fs-xs">Ends Date</span>
            <br/><b class="fs-sm">{showUTCDatetime(plan.endsUTC)} UTC</b>
          </p>
          <!-- HIDE FEE UNTIL GET FIXED -->
          <!-- <p class="px-6">
            <span class="fs-xs">Credential Fee</span>
            <br/><b class="fs-sm">{plan.fee} MINA</b>
            {#if plan.fee > 0}
            <Alert color="info" class="fs-xs">
        Minimum fee to operate {minFee} MINA</Alert>
              {/if}
          </p>  -->
        </div>
      </div>
    </div>

    <div class="m-0 p-0 mt-4">
      <Alert color="warning" class="p-3 fs-md lh-md">
        All submissions are due by <b>{showUTCDatetime(plan.endsUTC)} UTC </b>
          {#if (plan.endsUTC)}<br>({prettyDateFull(plan.endsUTC)} at your local time){/if}
      </Alert>
    </div>

  </Section>
  
  <Section class="section-md px-5 text-start">
    <EvidenceForm 
      evidenceForm={plan.evidence}
      bind:data={claim.evidenceData}
    />

    {#if !dataIsOk(claim.evidenceData)}
      <Alert color="warning" class="p-3 fs-bold">
        Required data missing or has errors. 
        <br>Please save as draft and submit when completed.
      </Alert>
    {/if}

    <hr>

    <div class="mt-2 mb-5 px-2 d-flex justify-content-center align-items-center">
      <SubmitButton 
        disabled={!isSubmissionEnabled(submissionDateUtc)}
        on:click={() => saveDraft()}
        color="secondary" 
        label={savingDraft ? "Saving" : "Save draft ..."}
      />
      &nbsp;&nbsp;

      <SubmitButton 
        disabled={!dataIsOk(claim.evidenceData) || !isSubmissionEnabled(submissionDateUtc)}
        on:click={() => saveDraftAndSubmit()}
        color="primary" 
        label={submitingClaim ? "Submitting ..." : "Claim now !"}
      />

      {#if !isSubmissionEnabled(submissionDateUtc)}
        <Alert color="warning" class="p-3 fs-bold">
          Submission is due for new claims!
        </Alert>
      {/if}
    </div>
  </Section>        

  <!-- <Filler n=40/> -->
</DetailPageContent>

<ConfirmSubmitDialog 
  toggle={toggle} 
  plan={plan}
  bind:open={openConfirmDlg} 
  on:submit_confirmed={submitIt}
/>
{/if}
<script>
  import { onMount, tick } from "svelte";
  import { Alert } from "sveltestrap";
  import Section from "@components/Section.svelte";
  import SubmitButton from "@components/buttons/SubmitButton.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import StateBadge from "@components/badges/StateBadge.svelte";
  import { prettyDate, prettyDateFull, showUTCDatetime } from "@utilities/datetime";
  import { addClaim, updateClaim, updateProfile, submitClaim } from "@apis/mutations";
  import EvidenceForm from "./EvidenceForm.svelte";
  import ConfirmSubmitDialog from "./ConfirmSubmitDialog.svelte";
  import { isAllValid } from "./validations";
  import { fixEvidenceData } from './fix-evidence-data';
  import { UID } from "@utilities/uid";
  
  export let data; // this is the data for this MasterPlan and empty Claim
  let { claim, isNew, claimUid, planUid } = data;
  let plan = null;
  let community = null;
  const minFee = 2; // Todo get from API
  let user = getCurrentUser();
  let loading = false;
  let openConfirmDlg = false;
  let canSubmit = false;
  const toggle = () => (openConfirmDlg = !openConfirmDlg);
  let savingDraft = false, submitingClaim = false;

  const submissionDateUtc = plan.endsUTC;

  console.log("DATE", plan.endsUTC)

  onMount(() => {
    user = getCurrentUser();
    if (isNew) {
      const newClaim = initNewClaim(planUid, user);
      claim = newClaim.claim;
      plan = newClaim.plan;
      community = newClaim.community;
    } else {
      const claimExtraData = loadClaimExtraData();
      plan = claimExtraData.plan;
      community = claimExtraData.community;
      claim.community = community.name;
      claim.type = plan.name;
      claim.description = plan.description;
      claim.image = plan.image; 
      claim.evidenceData = fixEvidenceData(plan.evidence, claim.evidenceData);
    }
  })

  /** Data validation **/

  function dataIsOk(evidenceData) {
    return isAllValid(plan.evidence, evidenceData);
  }

  async function initNewClaim(planUid, user) {
    const plan = await getPlan(planUid);
    const community = await getCommunity(plan.communityUid);

    let oClaim = {
      uid: UID.uuid4(),
      communityUid: plan.communityUid,
      planUid: plan.uid,
      applicantUid: user.uid,
      accountId: "",
      // derived form MasterPlan name for this credential
      type: plan.name, 
      description: plan.description,
      state: 1, // DRAFT
      community: community.name,
      image: plan.image, 
      // activity times
      createdUTC: null,
      updatedUTC: null,
      votedUTC: null,
      issuedUTC: null,
      dueUTC: plan.dueUTC,
      // voting results
      requiredVotes: plan.requiredVotes, // copied from MasterPlan
      requiredPositives: plan.requiredPositives,
      positiveVotes: 0,
      negativeVotes: 0,
      ignoredVotes: 0,
      // evidence data
      evidenceData: (plan.evidence || []).map((f) => {
        f.value = "";
        return f;
      })
    };

    return { 
      claim: oClaim, 
      plan: plan,
      community: community,
    }; 
  }

  async function loadClaimExtraData() {
    const plan = await getPlan(claim.planUid);
    const org = await getCommunity(claim.communityUid);
    return { 
      plan: plan,
      community: org
    }; 
  }

  /**
   * Updates the Claim before doing any other action, such as 
   * paying and then submiting the claim.
   */
  async function updateTheDraft() {
    let updated;
    if (data.isNew) {
      updated = await addClaim(claim);
    }
    else {
      updated = await updateClaim(claim);
    }
    return updated;
  }

  /**
   * This just saves the claim draft to the server and goes to previous page.
   */
  async function saveDraft(mustSubmit) {
    savingDraft = true;
    let updated = await updateTheDraft();
    savingDraft = false;

    if (!updated) {
      alert("There has been some problem. Please retry again later.");
      return null; // saving the draft failed, we can not continue ...
    }

    if (updated && mustSubmit) {
      try {
        updated.evidenceData = JSON.parse(updated.evidenceData)
      }
      catch (err) {
        console.log("Error parsing evidence data ", err)
      }
      return updated;
    }

    if (updated && !mustSubmit) {
      alert("Your draft has been saved !");
      history.back();
    } 
  }

  /**
   * First saves the draft and then asks for payment before submiting 
   * the claim to the API and starting the MINA transaction.
   * The Payer is the logged user who needs to pay for the Credential, and
   * is transfered to the Socialcap (main) account.
   * The new Claim deployment is payed by the SocialcapFeePayer account.
   */
  async function saveDraftAndSubmit() {
    claim.new = data.isNew;

    // wait for confirmation  
    openConfirmDlg = true;
  }

  function isSubmissionEnabled(dateString) {
    const date = new Date(dateString);
    // Get the current local browser time
    const localDate = new Date(); 
    console.log("dates", date, localDate)
    // Compare the two dates
    return localDate < date;
  }

  function prettyDateToLocale(utcDateStr) {
    const utcDate = new Date(utcDateStr)
      const options = {
      year: "long",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "none",
      hour12: false, // Use 24-hour format
      timeZoneName: "long"
    };
    return utcDate.toLocaleString();
  }

  async function submitIt() {
    // if it is not an already saved draft
    // we first save it as a Draft 
    let savedDraft = null;
    savedDraft = await saveDraft(true);
    if (!savedDraft) {
      alert("There has been some problem. Please retry again later.");
      return;
    }

    // draft was saved, now submit it !
    submitingClaim = true;
    claim.new = false;
    let submited = await submitClaim({
      claim: savedDraft,
      extras: {
        transaction: "",
        addToQueue: true,
        waitForPayment: false
      }
    });
    submitingClaim = false;

    if (submited) {
      alert("Your claim has been submmited !");
      history.back();
    } else {
      alert("There has been some problem. Please retry again later.");
    }
  }
</script>
