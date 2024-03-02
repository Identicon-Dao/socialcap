<div>
  <div class="d-flex align-items-left p-3">
      <MasterPlanSelector 
      bind:value={planSelected} label="Master Plan" options={plans.map(p => ({ value: p.uid, text: p.name}))} placeholder="Select a Master Plan" />
  </div>
  {#if (planSelected)}
  <div class="d-flex justify-content-between align-items-center p-3">
    <div class="col-2 me-2">
      <Input 
        type="search" 
        class="w-100"
        placeholder="Search ..."
        bind:value={contains} 
      />
    </div>

    <div class="w-50 d-flex justify-content-end align-items-center me-2">
      <Dropdown autoClose="inside" size="sm">
        <DropdownToggle class="--bg-light" caret>Columns</DropdownToggle>
        <DropdownMenu>
          {#if ((fields || []).length >0)}
            {#each fields as field}
              {#if !field.isRemark}
                  <DropdownItem>
                    <Input 
                      type="checkbox" 
                      label={field.label}
                      checked={field.selected}
                      on:change={() => field.selected = !field.selected}
                    />
                  </DropdownItem>  
              {/if}
            {/each}
          {/if}
        </DropdownMenu>
      </Dropdown> 
      &nbsp;

      <!-- <Dropdown autoClose="inside" size="sm">
        <DropdownToggle caret>Order by</DropdownToggle>
        <DropdownMenu>
          {#each fields as field}
            <DropdownItem>
              <Input 
                type="checkbox" 
                label={field.label}
                bind:checked={field.selected}
              />
            </DropdownItem>  
          {/each}
        </DropdownMenu>
      </Dropdown>    
      &nbsp; -->

      <Button outline color="dark" class="rounded-2">
        <a 
          href={downloadLink.href} 
          download={downloadLink.fileName}>
          <Icon name="download" class="text-black" />
        </a>
      </Button>
    </div>
  </div>
  <table class="table table-striped table-hover">
    <thead>
      <ClaimItemHeader fields={fields} columns={columns} />
    </thead>
    <tbody>
      {#if (filteredClaims)}
        {#each filteredClaims as claim}
          <ClaimItem claim={claim} columns={columns} />
        {/each}
      {/if}
    </tbody>
  </table>
  {/if}
</div>

<script>
  import { Input, Dropdown, DropdownMenu, DropdownItem, DropdownToggle, Button } from "sveltestrap";
  import MasterPlanSelector from "@components/MasterPlanSelector.svelte";
  import { Icon } from 'sveltestrap';
  import ClaimItem from "./ClaimItem.svelte";
  import ClaimItemHeader from "./ClaimItemHeader.svelte";
  import { ALL_STATES } from "@models/states";
  import { getAPIConfig } from "$lib/globals"

  export let communityUid, claims= [], plans = [];

  let 
    columns = [],
    contains = "",
    orderBy = [],
    planSelected = plans.length > 0 ? plans[0].uid : undefined;
    

  $: planClaims = claims.filter(c => c.planUid === planSelected)
  $: fields = prepareColumnsSelector(planClaims);
  $: searchableClaims = makeSearchable(planClaims);
  $: downloadLink = setDownloadLink(planSelected);
  $: columns = filterSelected(fields);
  $: filteredClaims = filterClaims(searchableClaims, contains);

  function makeSearchable(claims) {
    if ((claims || []).length === 0) 
      return;

    claims = claims.map((claim) => {
      let values = Array.isArray(claim.evidenceData) ? claim.evidenceData : JSON.parse(claim.evidenceData);
      if (typeof values === 'string') 
        values = JSON.parse(values);
      if (values.length === 0)
        return claim;
      const texts = (values || []).map((t) => "["+t.value+"]").join("");
      claim.searchable = (texts
        +(claim.applicant ? claim.applicant.fullName : "")
        +ALL_STATES[claim.state])
        .toUpperCase();

      claim.evidenceData = Array.isArray(claim.evidenceData) ? claim.evidenceData: JSON.parse(claim.evidenceData);
    
      return claim;
    })

    return claims;
  }


  function prepareColumnsSelector(claims) {
    if ((claims || []).length === 0) 
      return [];
    const evidenceData = Array.isArray(claims[0].evidenceData) ? claims[0].evidenceData : JSON.parse(claims[0].evidenceData);
    if (evidenceData.length === 0) 
      return [];
    return evidenceData
      .map((t, j) => {
        return {
          label: t.label,
          index: j,
          isRemark: (t.type === 'remark'),
          selected: false
        }
      }) 
  }


  function filterSelected(fields) {
    if ((fields || []).length === 0) 
      return;

    let cols = fields.filter((t) => t.selected).map((t) => t.index);
    console.log("cols", cols)
    return cols;
  }

  
  function filterClaims(claims, word) {
    if (!contains.trim().length)
      return claims;
    word = word.toUpperCase();
    let filtered = [];
    claims.forEach((claim) => {
      let ok = claim.searchable.includes(word);
      if (ok) filtered.push(claim);
    });
    return filtered;
  }

  function setDownloadLink(planSelected) {
    const api = getAPIConfig();
    return {
      href: (
        `${api.baseUrl}/download/plan_claims?uid=${communityUid}&planUid=${planSelected}`
      ),
      fileName: "claims.csv"
    }
    // const hiddenElement = document.createElement('a');
    // hiddenElement.href = 'data:attachment/text,' + encodeURI(content);
    // hiddenElement.target = '_blank';
    // hiddenElement.download = 'claims.csv';
    // hiddenElement.click();
  }
</script>