<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: `Claimed #${data.uid}`}
]}/>

<DetailPageContent>
  <!-- <Sidenote>
    <hr/>
    <p>::: DETAIL INFO OF A RUNNING CLAIM :::</p>
    <p>This is the detail view of an existing running Claim. Once submited it can not be modified !</p>
    <p>We only arrive here if the user has made a Claim as member of some community.</p>
  </Sidenote> -->

  <Section class="section-md">
    <div class="d-flex align-items-center justify-content-between pt-4">
      <img src={data.image} alt="Badge" width="22.5%" crossorigin/>

      <div class="w-100 ps-4">
        <div class="header">
          <h3 class="text-black d-flex justify-content-between align-items-center">
            <span>{data.type}</span>
            <span class="fs-5">
              <StateBadge state={data.state} />
            </span>
          </h3>
          <p class="fs-sm text-secondary lh-lg text-start">
            {@html data.description}
            <br>
            <b class="">{data.community}</b>
          </p>
        </div>

        <h6 class="mt-1 text-secondary">Votes</h6>
        <div class="d-flex justify-content-between fs-sm text-left lh-lg">
          <p><Badge color="secondary rounded-5 ms-1 py-1 px-2 fs-6">{data.requiredVotes}</Badge><br>required</p>
          <p><Badge color="success rounded-5 py-1 px-2 fs-6">{data.positiveVotes}</Badge><br>positive</p>
          <p><Badge color="danger rounded-5 py-1 px-2 fs-6">{data.negativeVotes}</Badge><br>negative</p>
          <p><Badge color="warning rounded-5 py-1 px-2 fs-6">{data.ignoredVotes}</Badge><br>abstained</p>
        </div>

        <div class="d-flex justify-content-start">
          <p class="">
            <span class="fs-xs">Submited</span>
            <br/><b class="fs-sm">{prettyDate(data.createdUTC)}</b>
          </p>
          <p class="px-4">
            <span class="fs-xs">Ends</span>
            <br/><b class="fs-sm">{prettyDate(data.dueUTC)}</b>
          </p>
          <p class="px-4">
            <span class="fs-xs">Approved</span>
            <br/><b class="fs-sm">{prettyDate(data.votedUTC)}</b>
          </p>
          <p class="px-4">
            <span class="fs-xs">Issued</span>
            <br/><b class="fs-sm">{prettyDate(data.issuedUTC)}</b>
          </p>
        </div>
      </div>
    </div>
    <hr/>
  </Section>

  <Section class="section-sm pt-4 pb-5">
    <h6 class="mt-3 text-secondary">Your provided evidence</h6>
    {#each data.evidenceData as field}
      <div class="d-flex justify-content-start align-items-start border-top pt-3 pb-0">
        <p class="ps-0 py-0 fw-bold fs-sm w-25 text-start">{field.label}</p>
        <p class="px-2 py-0 --fs-6 w-75 text-start">{field.value}</p>
      </div>
    {/each}
    <div class="border-top"></div>
  </Section>

  <!-- <Filler n=40/> -->
</DetailPageContent>

<script>
  import { onMount } from "svelte";
  import { Icon, Badge, Form, FormGroup, FormText, Label, Input, Button } from 'sveltestrap';
  import Filler from "@components/Filler.svelte";
  import Sidenote from "@components/Sidenote.svelte";
  import Section from "@components/Section.svelte";
  import BackButton from "@components/BackButton.svelte";
  import { getCurrentUser } from "@models/current-user";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { prettyDate } from "@utilities/datetime";
  import StateBadge from "@components/StateBadge.svelte";

  export let data; // this is the data for this MasterPlan and empty Claim

  let 
    user = getCurrentUser();

  onMount(() => {
    user = getCurrentUser()
  })
</script>