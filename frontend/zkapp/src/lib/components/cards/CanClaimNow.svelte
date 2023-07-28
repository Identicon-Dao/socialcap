<div class="w-100">
  <Card class="border-sc rounded-1">
    <CardHeader>
     
      <div class="m-4 d-flex justify-content-start align-items-between position-relative">
        <!-- <img src={data.image} width="110px" class="mt-0" alt="..." crossorigin>   -->
        <img src={data.image} style="max-width:120px;" width="auto" class="img-thumbnail img-fluid mt-0" alt="..." crossorigin>  
        
        <div class="ps-4 container-fluid w-100 h-100">
         
          <div class="container-fluid text-start g-0 flex-column d-flex justify-content-between mb-3">  

            <h5 class="text-black py-0 p-0 m-0">{data.name}</h5>
            <p class="text-black lh-base fs-4 p-0 m-0">{data.community}</p>
          </div>
          <p class="text-black p-0 m-0">{data.description}</p>

        </div>
      </div>
    </CardHeader>

    <CardBody class="d-flex justify-content-between align-items-center">
      <div class="d-flex justify-content-start gap-4">

        <div class="d-flex flex-column justify-start">
          <small class="m-0 fs-6 color-dark text-uppercase letter-spacing-sc-1">Start Date</small>
          <p class="fs-sm fw-bold">{prettyDate(data.startsUTC)}</p>
        </div>

        <div class="d-flex flex-column justify-start">
          <small class="m-0 fs-6 color-dark text-uppercase letter-spacing-sc-1">Ends Date</small>
          <p class="fs-sm fw-bold">{prettyDate(data.endsUTC)}</p>
        </div>

      </div>

      <div class="d-inline-block rounded-4 border border-2 border-white">

        <!-- <div class="badge-sc">
          <p class=" rounded-5 bg-white border border-1 border-gray pe-2">
            <Badge color="danger" pill class="fs-5">4</Badge>
            <span class="fs-xs d-inline-block m-0 p-0 lh-1">Available</span>
          </p>
        </div> -->


        <span>Only <Badge color="danger"  pill class="opacity-85 fs-4">{data.available}</Badge> left</span>
        &nbsp;
        <a href={`/credential/edit/${data.uid}?isnew`} class="text-white text-decoration-none fs-sm">
          <Button class="px-4 fs-2 py-2 rounded-3 bg-primary text-white border-0" color="primary" size="sm">
            Claim it now
          </Button>
        </a>
      </div>
    </CardBody>
  </Card>
</div>

<script>
  import { Badge, Button, Card, CardBody, CardHeader } from "sveltestrap";
  import { prettyDate } from "@utilities/datetime";

  export let data={};
</script>
