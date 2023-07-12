<script>
  import { onMount } from "svelte";
  import { goto } from "$app/navigation";
  import { getItem } from "$lib/utility/localStorageController";
  import { page } from "$app/stores";

  // local imports ...
  import { Styles } from "sveltestrap";
  import RootHeader from "@components/RootHeader.svelte";

  // Hexui
  let isAuthenticated = getItem("access_token");
  let currentPage = $page.url.pathname;

  onMount(async () => {
    if (isAuthenticated && isAuthenticated !== "") {
      goto(currentPage);
    } else {
      goto(`/signin`);
    }
  });
</script>

<!-- MUST include here Bootstrap styling 
-->
<Styles />

<svelte:head>
  <title>Socialcap</title>
</svelte:head>

<div>
  <slot />
</div>

<!--
  MINA original not used here
-->
<style global>
  @import "/css/custom.min.css";
</style>
