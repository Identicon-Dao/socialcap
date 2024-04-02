<div class="mx-3 border-0 border-bottom border-secondary-subtle">
    <div class="p-3 fs-sm text-secondary d-flex justify-content-start align-items-start">
        <img 
          src={data.planImage} crossorigin 
          alt="Credential logo" 
          width="42px" 
          class="img-thumbnail rounded-2 ms-3 me-3 mt-2"
          />

        <div class="col-4">
          <p class="fs-md p-0 m-0">
            <b class="text-black">{data.claimer}</b>
            <!-- <span class="fs-nm ms-2">
              <StateBadge state={data.claim.state} />
            </span> -->
    
            <br>
            <a href={`credential/claimed/${data.claimUid}`}>
              Claim: <b>{claimIdn}</b>
            </a>
          </p>

          {#if data.state === ASSIGNED}
            <div class="d-flex justify-content-start m-0 py-1">
              <p class="p-0 m-0">
                <span class="fs-sm">Assigned</span>
                <b class="fs-sm">{prettyDate(data.assignedUtc)}</b>
                &nbsp;
                <span class="fs-sm">Due</span>
                <b class="fs-sm">{prettyDate(data.dueUtc)}</b>
                &nbsp;
                <span class="fs-sm">Voting</span>
                <b class="fs-sm">
                  {data.claimPositiveVotes+data.claimNegativeVotes+data.claimIgnoredVotes} 
                  / {data.claimRequiredVotes}
                </b>
              </p>
            </div>
          {/if}          
        </div>

        <div class="w-100 me-3 ms-4 fs-nm text-black">
          {evidenceToText(data.claimEvidenceData, columns)}
        </div>

        <div class="col-2 text-end">
          <ClaimVoteToggle uid={data.uid} bind:state={data.result} />
        </div>
    </div>
</div>      



<script>
  import { Badge, Button, Card, CardBody, CardHeader } from "sveltestrap";
  import StateBadge from "@components/badges/StateBadge.svelte";
  import { ASSIGNED } from "@models/states";
  import { prettyDate } from "@utilities/datetime";
  import ClaimVoteToggle from "./ClaimVoteToggle.svelte";

  import { goto } from "$app/navigation";
  import { Input } from "sveltestrap";
  import Markdown from "svelte-exmarkdown";
  import EvidenceFieldView from "@components/claims/EvidenceFieldView.svelte";
  //import ClaimStateToggle from "./ClaimStateToggle.svelte";
  import { getAPIConfig } from "$lib/globals";

  export let data, columns;
  
  let claimIdn = data.claimUid.slice(0,6)+'...'+data.claimUid.slice(-6);

  const api = getAPIConfig();

  /**
   * Convert the field value to a safe text representation
   * @param field
   * @returns string
   */
  function valueToString(field) {
    if (!field) return "";

    if (['text','note','radio'].includes(field.type))
      return (field.value?.substring(0, 160) || "");

    if (['links','files','images','checks'].includes(field.type))
      return (field.value || []).filter(t => t.trim() !== "").join(',');

    if (field.type === 'remark')
      return "";

    return "";
  }

  function evidenceToText(evidenceData, columns) {
    const evidence = JSON.parse(evidenceData);
    let content = "";
    columns.forEach((col) => {
      let field = evidence[col];
      content = content + `${valueToString(field)}, `;
    })
    return content;
  }
</script>