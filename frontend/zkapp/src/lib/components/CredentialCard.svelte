<div class="bg-light">
  <Card class="rounded-1 border-sc mb-3 bg-white  ">
    <a href={`/credential/issued/${uid}`} class="text-decoration-none text-dark">
      <CardBody class="py-4 ps-4">
        <div class="d-flex justify-content-start align-items-center pt-0">
          <!-- <img src={data.image} width="92px" crossorigin alt="Credential logo" /> -->
          <img src='/img/vars/BadgeGenerico.png' width="120px" crossorigin alt="Credential logo" />
    
          <div class="ms-4 text-left">
            
            <Badge class='border-2 border-primary border bg-white text-primary'>{data.type}</Badge>
            <Badge class='border-2 border-success border bg-success text-white'>AWARDED</Badge>
     
            <div class="d-flex flex-column mt-4">
              <p class="fs-2 text-black lh-base mt-2 mb-0">
                <b>{data.issuedBy}</b>
              </p>
              <p class="fs-sm text-black lh-base mt-2 mb-0">
                {data.description} 
              </p>
            </div>
              
          </div>
        </div>
      </CardBody>
    </a>
  </Card>
</div>

<script>
  import { goto } from "$app/navigation";
  import { Icon, Badge, Button, Card, CardBody, CardHeader } from "sveltestrap";
  import FullviewButton from "./FullviewButton.svelte";

  export let uid, data;
</script>

<style>
</style>
