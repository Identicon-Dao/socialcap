<script>
	import { page } from '$app/stores';
	import BackButton from '@components/BackButton.svelte';
  const online = typeof navigator !== 'undefined' ? navigator.onLine : true;
  export let message = "";
</script>


<section class="py-3 py-md-5 min-vh-100 d-flex justify-content-center align-items-center">
  <div class="container">
    <div class="row">
      <div class="col-12">
        <div class="text-center">
          <h2 class="d-flex justify-content-center align-items-center gap-2 mb-4">
						<span class="display-1 fw-bold">4</span>
						<i class="bi bi-exclamation-circle-fill text-danger display-4" />
						<span class="display-1 fw-bold bsb-flip-h">4</span>
					</h2>
          <h3 class="h2 mb-2">Oops! You're lost.</h3>
          <p class="mb-5">{message || "The page you are looking for was not found."}</p>
         <BackButton label="Back to Home" route="/"/>
        </div>
      </div>
    </div>
  </div>
</section>