
<div class="row fs-sm mx-0 mb-2 ps-4 py-1 border-bottom border-1">
  <span class="col-1 text-center">
    <img src={plan.image} 
      alt={plan.image ? "Claim logo" : " "} 
      width="56px" crossorigin/>
  </span>
  <div class="col lh-base text-start">
    <a href={`/admined/master-plan/${plan.uid}`} class="text-dark text-decoration-none">
      <b>{plan.name || "No name yet ..."}</b>
      <p class="fs-sm text-secondary m-0">
        {plan.description || "No description yet ..."}
      </p>
    </a>
    <Badge pill color={stateColors[plan.state]}>{ALL_STATES[plan.state] || ""}</Badge>
  </div>
  <span class="col-4 fs-xs">
    <div class="row">
      <span class="col-4">Created<br>{plan.createdUTC.slice(0,10)}</span>   
      <span class="col-4">Starts<br/>{(plan.startsUTC || "---").slice(0,10)}</span>   
      <span class="col-4">Ends<br/>{(plan.endsUTC || "---").slice(0,10)}</span>   
    </div>
  </span>
</div>

<script>
  import { Badge } from "sveltestrap";
  import { ALL_STATES } from "@socialcap/contracts";

  export let plan; 

  // [1,2,9,8,10]; // DRAFT,CANCELED,WAITING,ACTIVE,DONE
  let stateColors = {
    1: "warning",
    9: "info",
    8: "success",
    10: "secondary",
    9: "danger"
  }
</script>
