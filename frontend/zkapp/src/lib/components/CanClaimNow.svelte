<div class="card-container">
  <Card class="border-1 shadow">
    <CardHeader>
      <div class="position-relative text-left m-0 pb-2">
        <img src={data.image} width="160px" class="mt-3 --card-img-top" alt="..." crossorigin>  
        <div class="d-inline-block position-absolute top-0 end-0">
          <p class="d-inline-block rounded-5 border border-1 pe-2 mt-2">
            <Badge color="danger" pill class="fs-6">3</Badge>
            <span class="fs-xs d-inline-block m-0 p-0 lh-1">Available</span>
          </p>
        </div>
        <div class="d-inline-block position-absolute bottom-0 end-0 rounded-4 border border-2 border-white">
          <a href={`/credential/edit/${uid}?new`} class="text-white text-decoration-none fs-sm">
            <Button class="rounded-4 px-3 fs-sm" color="primary" size="sm">
              Claim it now !
            </Button>
          </a>
        </div>
      </div>

      <div class="text-left lh-base fs-sm">
        <h5 class="mt-2 mb-2 py-0 fw-bold">{data.name}</h5>
        <span class="text-secondary">{data.description}</span>
        <br>By <b class="">{data.community}</b>
      </div>
    </CardHeader>

    <CardBody class="my-0 pt-1">
      <div class="d-flex justify-content-start">
        <p class="">
          <span class="fs-xs">Start Date</span>
          <br/><b class="fs-sm">{data.startsUTC}</b>
        </p>
        <p class="px-4">
          <span class="fs-xs">Ends Date</span>
          <br/><b class="fs-sm">{data.endsUTC}</b>
        </p>
      </div>
    </CardBody>
  </Card>
</div>

<script>
  import { Badge, Button, Card, CardBody, CardHeader } from "sveltestrap";
  import FullviewButton from "./FullviewButton.svelte";

  export let uid, data={};
</script>
