  
<div class="row fs-sm mx-0 mb-2 ps-4 py-1 border-bottom border-1">
  <span class="col-7">
    <h6>{p.fullName}</h6>
  </span>
  <span class="col-3">
    <Badge color={stateColors[p.state]} class="py-2">{p.state}</Badge>
    <Badge pill color="secondary" class="px-2 py-2">{p.appliedUTC}</Badge>
  </span>
  <span class="col-2">
    {#if p.state === 'APPLIED'}
    <Button 
      on:click={() => { p = changeState(p); }}
      outline size="sm" color="secondary">
      Accept it
    </Button>
    {/if}
  </span>
</div>

<script>
  import { Badge, Button } from "sveltestrap";

  export let p; 

  let stateColors = {
    "APPLIED": "warning",
    "ACCEPTED": "success",
    "DENIED": "danger"
  }

  function changeState(p) {
    p.state = 'ACCEPTED';
    return p;
  }
</script>