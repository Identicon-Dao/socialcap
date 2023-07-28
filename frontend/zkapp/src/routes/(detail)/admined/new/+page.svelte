<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: 'Register your community'}
  ]} />

<DetailPageContent>
  <Section class="section-sm pb-5 text-start">
        <!-- <Alert color="nolight mb-4"> -->
      <div class="mt-4">
        <!-- <h4 class="alert-heading text-capitalize">
            Caution
          </h4> -->
        <b class="fs-5">Are you one of the Administrators of this community ?</b>
        <p class="fs-sm lh-lg mt-1">
          We <a href="#todo" class="text-danger">will check this before approving</a>
          the community registration.
        </p>
      </div>
      <!-- </Alert>   -->

      <Form>
        <FormGroup class="mt-4">
          <Label class="fw-bold fs-6 text-secondary ps-1 mb-1">Community name</Label>
          <Input bind:value={data.name} invalid={!data.name.trim()} type="text" class="form-control" placeholder=""
            feedback="Provide a name for this community." />
        </FormGroup>

        <FormGroup class="mt-2">
          <Input bind:value={data.description} type="textarea" class="form-control" id="exampleFormControlTextarea1"
            rows="3" placeholder="Describe its goals, membership rules, etc here ..." invalid={!data.description.trim()}
            feedback="Provide a description for this community." />
        </FormGroup>

        <FormGroup class="mt-5">
          <Input bind:checked={data.accepted} class="checkbox" type="checkbox" id="check-grp-2"
            label="I agree with the Terms and Conditions" />
          {#if !data.accepted}
            <p class="py-1 ">
              <!--Before submiting this, please note that in order to avoid spurious registrations we will latter require you to <b>deposit two (2) MINA tokens</b> to complete the registration. 
                Please note that to complete the registration you will need to <b>deposit two (2) MINAs</b>.
              -->
              <small>Please accept the <a href="/terms-and-conditions">Terms and 
                Conditions</a> for registering communities.</small>
              </p>
          {/if}
        </FormGroup>

        <div class="button-group d-flex pt-3">
          {#if dataIsOk(data)}
            <Button color="primary" size="lg"
              class="fs-6 btn-rounded squared text-capitalize"
              on:click={registerIt}
              disabled={!dataIsOk(data)}>
              Register it now !
            </Button>
            &nbsp;
          {:else}
            <p>Please complete the required info ...</p>
          {/if}
        </div>

      </Form>
  </Section>
</DetailPageContent>

<script>
  import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalBody,
    ModalHeader,
    Form,
    FormGroup,
    Input,
    Label,
    Alert
  } from 'sveltestrap';
  import { onMount } from "svelte";
  import Filler from "$lib/components/Filler.svelte";
  import EmptyFirstTime from "$lib/components/EmptyFirstTime.svelte";
  import EmptyCredentials from "$lib/components/EmptyCredentials.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import Section from '@components/Section.svelte';
  import DetailPageContent from '@components/DetailPageContent.svelte';
  import DetailPageHeader from '@components/DetailPageHeader.svelte';
  import { AppStatus } from '@utilities/app-status';
  import { updateCommunity } from '@apis/mutations';
	
  let user = null;

  let data = {
    name: "",
    description: "",
    accepted: false
  }

  onMount(async () => {
    user = await getCurrentUser();
  })

	function cancelIt() { history.back() };

  function dataIsOk(data) {
    return (data.name.trim() && data.description.trim() && data.accepted);
  }

  async function registerIt() {
    if (!dataIsOk(data)) {
      AppStatus.error("All fields are required !")
      return;
    }
    data.new = true; // indicate it is a new community !
    data.adminUid = user.uid;
    data.state = "INITIAL";
    const updated = await updateCommunity(data);
    if (updated) 
      history.back();
  }
</script>