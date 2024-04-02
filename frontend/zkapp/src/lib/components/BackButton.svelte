<!-- <div class="position-absolute top-0 start-0" style="margin-left:-2.5rem;margin-top:-2px;"> -->
<div class="d-inline-block">  
  <Button 
    on:click={() => route !== "" ? goto(route) : history.back()}
    outline 
    color="light" class={"d-flex align-items-center justify-content-start border-0 lh-1 ps-0 pe-0 text-"+color+" "+size}>
    <Icon name="arrow-left-circle-fill"/>
    {#if label}<span class="fs-5">&nbsp;&nbsp;{label}</span>{/if}
  </Button>
</div>

<script>
  import { Button, Icon } from "sveltestrap";
  import {goto} from "$app/navigation"
  export let 
    label = "",
    route = "",
    color = "secondary", 
    size = "fs-3";
</script>
