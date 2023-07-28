<!-- <div class="position-absolute top-0 start-0" style="margin-left:-2.5rem;margin-top:-2px;"> -->
<div class="d-inline-block" nostyle="margin-top:0rem;">  
  <Button 
    on:click={() => history.back()}
    outline 
    color="light" class={"d-flex align-items-center justify-content-start lh-1 p-0 m-0 text-"+color+" "+size}>
    <Icon name="x-circle-fill"/>
    {#if label}<span class="fs-4">&nbsp;&nbsp;{label}</span>{/if}
  </Button>
</div>

<script>
  import { Button, Icon } from "sveltestrap";
  export let 
    label = "",
    color = "primary",
    size = "fs-1";
</script>
