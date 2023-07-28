<div class="w-100">
  <Card class="">
      <CardHeader>
        <div class="d-flex justify-content-start align-items-center mt-2">
          <img src={data.image} width="30%" crossorigin alt="Community logo" />
          <div class="ms-3 mt-0">
            <span class="fs-6">
              <Badge color={stateColors[data.state]}>{data.state}</Badge>
            </span>
            <h6 class="mt-2">{data.name}</h6>
            <p class="fs-sm lh-base mt-2 text-left mb-0 text-secondary">
              {@html data.description}
              <br><b>{data.countMembers}</b> members
              | &nbsp; 
              <b>{data.countCredentials}</b> credentials issued
            </p>
          </div>
        </div>
      </CardHeader>

      <CardBody class="fs-sm">
        <div class="d-flex justify-content-start">
          <p class="p-0">
            <span class="fs-xs">Registered</span>
            <br/><b class="fs-sm">{data.createdUTC}</b>
          </p>
          <p class="ps-4 pe-0">
            <span class="fs-xs">Approved</span>
            <br/><b class="fs-sm">{data.approvedUTC || "---"}</b>
          </p>
          <p class="ps-4 pe-0">
            <span class="fs-xs">Updated</span>
            <br/><b class="fs-sm">{data.updatedUTC}</b>
          </p>
        </div>

        <p class="py-0 my-0">
          <a href={`/community/${data.uid}`} class="text-white text-decoration-none fs-sm">
            <Button color="primary" size="sm" class="rounded-5 px-3 py-1"
              on:click={() => joinIt(data.uid)}>
              Join now !
            </Button>
          </a>
        </p>
    </CardBody>
  </Card>
</div>

<Modal body 
  header="Join" 
  isOpen={openJoinDlg} toggle={toggleJoin}>
  Join this community
</Modal>

<script>
  import JoinCommunityDialog from "@components/dialogs/JoinCommunityDialog.svelte";
  import { Badge, Modal, Button, Card, CardBody, CardHeader } from "sveltestrap";
  import { getCurrentUser } from "@models/current-user";
  import { joinCommunity } from "@apis/mutations";

  export let uid = 0, data, joined = false;

  let openJoinDlg = false;
  const toggleJoin = () => (openJoinDlg = !openJoinDlg);

  let openBecomeDlg = false;
  const toggleBecome = () => (openBecomeDlg = !openBecomeDlg);

  const stateColors = {
    'DRAFT': 'warning',
    'APPROVED': 'success',
    'PAUSED': 'secondary',
    'REJECTED': 'danger'
  } 

  async function joinIt(communityUid) {
    let user = await getCurrentUser();
    const done = await joinCommunity({
      communityUid: communityUid,
      personUid: user.uid
    })

    if (done)
      history.back();
  }
  
</script>
