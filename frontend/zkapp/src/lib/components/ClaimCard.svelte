<div class="w-100 px-4">
  <Card class="border-0 border-bottom">
    <a href={(data.state === 1) 
        ? `/credential/edit/${data.uid}`
        : `/credential/claimed/${data.uid}`
      } class="text-decoration-none text-dark">
    <CardBody class="ps-4">
        <div class="d-flex justify-content-start align-items-center pt-0">
          <img src={data.image} width="92px" crossorigin alt="Credential logo" />
          <div class="ms-4 text-left">
            <p class="fs-sm text-secondary lh-base mt-2 mb-0">
              <b>{data.community}</b>
            </p>
            <h5 class="mt-0">{data.type}</h5>
            <p class="fs-sm text-secondary lh-base mt-2 mb-0">
              {data.description}
            </p>
            <p class="m-0 p-0 mt-1">
              <span class="fs-xs p-1 border border-1 border-dark rounded-2">Claimed  
              <b class="fs-sm">{prettyDate(data.createdUTC)}</b></span>
              <StateBadge state={data.state} />
            </p>
          </div>
      </CardBody>
    </a>
  </Card>
</div>

<script>
    import { goto } from "$app/navigation";
    import { Badge, Button, Card, CardBody, CardHeader } from "sveltestrap";
    import StateBadge from "./StateBadge.svelte";
    import { prettyDate } from "@utilities/datetime";


    export let data;
</script>
