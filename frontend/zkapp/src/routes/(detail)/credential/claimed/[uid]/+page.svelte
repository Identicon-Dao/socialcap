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
    <div class="d-flex align-items-center justify-content-between p-4 bg-white border-sc border-gray border border-1 rounded-4">
      <img src={data.image} alt="Badge" width="22.5%" crossorigin/>

      <div class="w-100 ps-4">
        <div class="header text-start">
          <p class="m-0 p-0 text-uppercase">{data.community}</p>
          <h3 class="text-black d-flex justify-content-between align-items-center">
            <span>{data.type}</span>
            <span class="fs-md text-end">
              <StateBadge state={data.state} />
            </span>
          </h3>
          <p class="fs-sm text-secondary lh-lg text-start  d-flex justify-content-between align-items-start">
            {@html data.description}
          </p>
        </div>

        <!-- <h6 class="mt-1 text-secondary">Votes</h6> -->
        <div class="d-flex justify-content-start gap-4 fs-sm text-left lh-lg">
          <p><Badge color="secondary rounded-5 ms-1 py-2 px-3 fs-4 m">{data.requiredVotes}</Badge><br>required</p>
          <p><Badge color="success rounded-5 py-2 px-3 fs-4">{data.positiveVotes}</Badge><br>positive</p>
          <p><Badge color="danger rounded-5 py-2 px-3 fs-4">{data.negativeVotes}</Badge><br>negative</p>
          <p><Badge color="warning rounded-5 py-2 px-3 fs-4">{data.ignoredVotes}</Badge><br>abstained</p>
        </div>
        
        <div class="d-flex justify-content-between text-start">
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
          <p class="pe-0 w-25">
          </p>
        </div>
      </div>
    </div>
  </Section>

  <Section class="section-md pt-4 pb-5 w-50">
    <h1 class="mt-3 text-black">Your provided evidence</h1>
    <ClaimPreview 
      evidenceData= {data.evidenceData}
    />
  </Section>

  <!-- <pre class="text-start">{JSON.stringify(data, null, 2)}</pre> -->
</DetailPageContent>

<script>
  import { onMount } from "svelte";
  import { Badge, Input } from 'sveltestrap';
  import Section from "@components/Section.svelte";
  import BackButton from "@components/buttons/BackButton.svelte";
  import { getCurrentUser } from "@models/current-user";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { prettyDate } from "@utilities/datetime";
  import StateBadge from "@components/badges/StateBadge.svelte";
  import ClaimPreview from "@components/claims/ClaimPreview.svelte";
  import { getPlan, getCommunity } from "@apis/queries";
  export let data; // this is the data for this MasterPlan and empty Claim

  let 
    user = getCurrentUser();
    let plan = null;
    let org = null;
   
  onMount(async () => {
    user = await getCurrentUser();
    plan = await getPlan(claim.planUid);
    org = await getCommunity(claim.communityUid);
    data.community = org.name;
    data.type = plan.name;
    data.description = plan.description;
    data.image = plan.image; 
    data.evidenceData = typeof(data.evidenceData) === 'string'
          ? JSON.parse(data.evidenceData)
          : data.evidenceData;  
  })
</script>