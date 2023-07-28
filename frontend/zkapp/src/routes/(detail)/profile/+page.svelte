<DetailPageHeader items={[
  { href: '/', text: 'Home'},
  { href: '', text: `Your profile`}
]}/>

<DetailPageContent>
  <!-- <Sidenote>
    <hr/>
    <p>::: USER CAN CLAIM A CREDENTIAL OF SOME COMMUNITY WHERE HE/SHE IS A MEMBER :::</p>
    <p>This is a form where he will claim a new credential, and this form is controlled by the MasterPlan.</p>
    <p>We only arrive here if the user already is a member of at least one community.</p>
  </Sidenote> -->
  <Section class="section-sm">
    <div class="d-flex align-items-center justify-content-between pt-4">
      <div class="w-25 me-4 pe-2 position-relative">
        <Button color="" class="p-0 m-0 rounded-circle" >
          <img src={data.image} class="img-thumbnail rounded-circle" alt="Profile" height="120px" crossorigin/>
        </Button>
      </div>

      <div class="w-75">
        <h3 class="text-black d-flex justify-content-between align-items-center">
          <span>{data.fullName}</span>
          <span class="fs-6">
            <Badge color="success">{data.state}</Badge>
          </span>
        </h3>

        <p class="fs-sm text-secondary lh-lg">
          {@html data.description}
        </p>

        <div class="d-flex justify-content-start">
          <p class="">
            <span class="fs-xs">Joined</span>
            <br/><b class="fs-sm">{data.createdUTC}</b>
          </p>
          <p class="px-4">
            <span class="fs-xs">Approved</span>
            <br/><b class="fs-sm">{data.approvedUTC}</b>
          </p>
          <p class="px-4">
            <span class="fs-xs">Updated</span>
            <br/><b class="fs-sm">{data.updatedUTC}</b>
          </p>
        </div>
      </div>
    </div>
  </Section>

  <Section class="section-sm">
    <Form>
      <FormGroup class="mt-3">
        <Label for="alias" class="fw-bold fs-6 text-secondary ps-1 mb-1">Full name or alias</Label>
        <Input 
          bind:value={data.fullName} 
          type="input" name="alias" id="alias" 
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
          Name or alias you would like to show in your profile. 
          &nbsp;{@html required(true)}
        </FormText>
      </FormGroup>

      <FormGroup class="mt-3">
        <Label for="email" class="fw-bold fs-6 text-secondary ps-1 mb-1">Your email</Label>
        <Input 
          bind:value={data.email} 
          type="input" name="email" id="email" 
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
          We need it to contact you. We will never share it with others. {@html required(true)} 
        </FormText>
      </FormGroup>

      <FormGroup class="mt-3">
        <Label for="description" class="fw-bold fs-6 text-secondary ps-1 mb-1">Briefing</Label>
        <Input 
          bind:value={data.description} 
          type="input" name="description" id="description" 
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
          A brief description about you that may be of interest to others.
        </FormText>
      </FormGroup>

      <FormGroup class="mt-3">
        <Label for="image" class="fw-bold fs-6 text-secondary ps-1 mb-1">Your photo or avatar</Label>
        <Input 
          bind:value={data.image} 
          type="input" name="image" id="image" 
          invalid={data.image?.trim().length > 127} 
          feedback="Image url too long (max is 128 chars)."
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
        </FormText>
      </FormGroup>

      <FormGroup class="mt-3">
        <Label for="accountId" class="fw-bold fs-6 text-secondary ps-1 mb-1">Your MINA account</Label>
        <Input 
          bind:value={data.accountId} 
          type="input" name="accountId" id="accountId" 
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
          This is the MINA account you will use to pay for some services and sign transactions. We will never share it with others. Is optional. 
        </FormText>
      </FormGroup>

      <FormGroup class="mt-3">
        <Label for="telegram" class="fw-bold fs-6 text-secondary ps-1 mb-1">Your Telegram</Label>
        <Input 
          bind:value={data.telegram} 
          type="input" name="telegram" id="telegram" 
          class="rounded-1 p-2 mb-1"/>
        <FormText color="muted ps-1">
          We may use it to contact you. We will never share it with others. Is optional. 
        </FormText>
        </FormGroup>

      <FormGroup class="mt-3">
        <Label for="phone" class="fw-bold fs-6 text-secondary ps-1 mb-1">Your phone</Label>
        <Input 
          bind:value={data.phone} 
          type="input" name="phone" id="phone" 
          class="rounded-1 p-2 mb-1"
          />
        <FormText color="muted ps-1">
          If available we may use it to secure your account. We will never share it with others. Is optional. 
        </FormText>
      </FormGroup>

      <div class="mt-5 mb-5 px-2 d-flex justify-content-center align-items-center">
          <SubmitButton on:click={() => saveProfile()}
            color="primary" label="Save changes !" />
      </div>
    </Form>
  </Section>        

  <!-- <Filler n=40/> -->
</DetailPageContent>

<script>
  import { onMount } from "svelte";
  import { Breadcrumb, BreadcrumbItem, Icon, Badge, Form, FormGroup, FormText, Label, Input, Button } from 'sveltestrap';
  import Filler from "$lib/components/Filler.svelte";
  import Sidenote from "@components/Sidenote.svelte";
  import Section from "@components/Section.svelte";
  import BackButton from "@components/BackButton.svelte";
  import SubmitButton from "@components/SubmitButton.svelte";
  import DetailPageContent from "@components/DetailPageContent.svelte";
  import DetailPageHeader from "@components/DetailPageHeader.svelte";
  import { getCurrentUser, isFirstTimeUser } from "$lib/models/current-user";
  import { updateProfile } from "@apis/mutations";

  export let data; // this is the data for this MasterPlan and empty Claim

  let 
    user, 
    firstTime = false;

  onMount(async () => {
    user = await getCurrentUser();
    firstTime = false; //isFirstTimeUser(user); 
  })

  const required = (t) => 
    `<span class="text-warning fw-bold">${t ? `Required` : ``}</span>.`;

  async function saveProfile() {
    let updated = await updateProfile(data);
    if (updated)
      history.back();
  }
</script>npm run de