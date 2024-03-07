<Dropdown autoClose={true} size="sm">

  <DropdownToggle class="bg-light border-0" caret>
    {#if updating}
      <Spinner size="sm" type="grow" />
    {:else}
      <RoleBadge role={role} />
    {/if}
  </DropdownToggle>

  <DropdownMenu>
    {#each [NONE, MEMBER, VALIDATOR, JUDGE] as role}
      <DropdownItem on:click={() => changeRole(role)}>
        {ALL_ROLES[role]}
      </DropdownItem>  
    {/each}
  </DropdownMenu>
</Dropdown>    

<script>
  import { tick } from "svelte";
  import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from "sveltestrap";
  import { Spinner } from "sveltestrap";
  import RoleBadge from "@components/badges/RoleBadge.svelte";
  import { changeMemberRole } from "@apis/mutations";
	import { ALL_ROLES, NONE, MEMBER, VALIDATOR, JUDGE } from "@models/roles";

  export let personUid, communityUid, role;

  let updating = false;

  async function changeRole(newRole) {
    updating = true;
    await tick();

    let rs = await changeMemberRole({
      personUid: personUid,
      communityUid: communityUid,
      role: newRole
    })

    updating = false;
    await tick();

    if (rs.error) 
      return;

    role = newRole;
  }
</script>
