<script>
	import { page } from '$app/stores';
    import FourOhFour  from "@components/errors/FourOhFour.svelte";
    import General from "@components/errors/General.svelte";
	import Offline from "@components/errors/Offline.svelte";
	// we don't want to use <svelte:window bind:online> here,
	// because we only care about the online state when
	// the page first loads
	const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
</script>

<div class="bg-container">
	{#if online}
		{#if $page.status == 404}
			<FourOhFour status={$page.status} message={$page.error.message} />
		{:else}
			<General status={$page.status} message={$page.error.message} />
		{/if}
	{:else}
		<Offline />
	{/if}
</div>
