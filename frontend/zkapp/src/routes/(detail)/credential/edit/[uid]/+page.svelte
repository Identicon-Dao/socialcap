<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: `Claim your credential`}
]}/>

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
          src={data?.plan.image} crossorigin 
          alt="Badge" 
          width="22.5%" 
          style="min-width:120px;min-height:120px;max-width:120px;" 
          class="img-thumbnail rounded-4 me-2 mt-2" 
          />
      </div>

      <div class="w-100 ps-2">
        <h3 class="text-black d-flex justify-content-between align-items-center">
          <span>{data.plan.name}</span>
          <span class="fs-5">
            <StateBadge state={data.claim.state} />
          </span>
        </h3>

        <p class="fs-sm text-secondary lh-lg text-start">
          {@html data.plan.description}
          <br><b>{data.community.name}</b>
        </p>

        <div class="d-flex justify-content-start">
          <p class="">
            <span class="fs-xs">Start Date</span>
            <br/><b class="fs-sm">{prettyDate(data.plan.startsUTC)}</b>
          </p>
          <p class="px-5">
            <span class="fs-xs">Ends Date</span>
            <br/><b class="fs-sm">{prettyDate(data.plan.endsUTC)}</b>
          </p>
          <p class="px-6">
            <span class="fs-xs">Credential Fee</span>
            <br/><b class="fs-sm">{data.plan.fee} MINA</b>
            {#if data.plan.fee > 0}
            <Alert color="info" class="fs-xs">
        Minimum fee to operate {minFee} MINA</Alert>
              {/if}
          </p> 
        </div>
      </div>
    </div>

    <div class="m-0 p-0 mt-4">
      <Alert color="warning" class="p-3 fs-md lh-md">
        All submissions are due by <b>{prettyDateFull(new Date(data.plan.endsUTC).toLocaleString())} at your local time</b>.</Alert>
    </div>

  </Section>
  
  <Section class="section-md px-5 text-start">
    <EvidenceForm 
      evidenceForm={data.plan.evidence}
      bind:data={data.claim.evidenceData}
    />

    {#if !dataIsOk(data.claim.evidenceData)}
      <Alert color="warning" class="p-3 fs-bold">
        Required data missing or has errors. 
        <br>Please save as draft and submit when completed.
      </Alert>
    {/if}

    <div class="mt-2 mb-5 px-2 d-flex justify-content-center align-items-center">
      <SubmitButton 
        on:click={() => saveDraft()}
        color="secondary" 
        label={savingDraft ? "Saving" : "Save draft ..."}
      />
      &nbsp;&nbsp;
      <SubmitButton 
        disabled={!dataIsOk(data.claim.evidenceData) || !isSubmissionEnabled(submissionDateUtc)}
        on:click={() => saveDraftAndSubmit()}
        color="primary" 
        label={submitingClaim ? "Submitting ..." : "Claim now !"}
      />
    </div>
  </Section>        

  <!-- <Filler n=40/> -->
</DetailPageContent>

<ConfirmSubmitDialog 
  toggle={toggle} 
  plan={data.plan}
  bind:open={openConfirmDlg} 
  on:submit_confirmed={submitIt}
/>

<script>
  import { onMount, tick } from "svelte";
  import { Alert } from "sveltestrap";
  import Section from "@components/Section.svelte";
  import SubmitButton from "@components/buttons/SubmitButton.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import StateBadge from "@components/badges/StateBadge.svelte";
  import { prettyDate, prettyDateFull } from "@utilities/datetime";
  import { addClaim, updateClaim, updateProfile, submitClaim } from "@apis/mutations";
  import EvidenceForm from "./EvidenceForm.svelte";
  import ConfirmSubmitDialog from "./ConfirmSubmitDialog.svelte";
  import { isAllValid } from "./validations";

  export let data; // this is the data for this MasterPlan and empty Claim
  const minFee = 2; // Todo get from API
  let user = getCurrentUser();
  let loading = false;
  let openConfirmDlg = false;
  let canSubmit = false;
  const toggle = () => (openConfirmDlg = !openConfirmDlg);
  let savingDraft = false, submitingClaim = false;

  // Due to an error during community creation, the MINA NAVIGATOR community ends date should be 2023-11-10 23:59 PST
  const MINA_NAVIGATOR_COMMUNITY_UID = "70ed0f69af174c399b1958c01dc191c0";
  const submissionDateUtc = data.plan.communityUid == MINA_NAVIGATOR_COMMUNITY_UID ? "2023-11-11T07:59:00.000Z" : data.plan.endsUTC;

  console.log("DATE", data.plan.endsUTC)

  onMount(() => {
    user = getCurrentUser();
  })

  /** Data validation **/

  function dataIsOk(evidenceData) {
    return isAllValid(data.plan.evidence, evidenceData);
  }

  /**
   * Updates the Claim before doing any other action, such as 
   * paying and then submiting the claim.
   */
  async function updateTheDraft() {
    let updated;
    if (data.isNew) {
      updated = await addClaim(data.claim);
    }
    else {
      updated = await updateClaim(data.claim);
    }
    return updated;
  }

  /**
   * This just saves the claim draft to the server and goes to previous page.
   */
  async function saveDraft() {
    savingDraft = true;
    let updated = await updateTheDraft();
    savingDraft = false;
    if (updated) {
      alert("Your draft has been saved !");
      history.back();
    } 
    else {
      alert("There has been some problem. Please retry again later.");
      return ; // saving the draft failed, we can not continue ...
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

    data.claim.new = true;
    // wait for confirmation  
    openConfirmDlg = true;
  }

  function isSubmissionEnabled(dateString) {
    const date = new Date(dateString);
    // Get the current local browser time
    const localDate = new Date(); 
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
    // was confirmed, do it !
    submitingClaim = true;
    let submited = await submitClaim({
      claim: data.claim,
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
