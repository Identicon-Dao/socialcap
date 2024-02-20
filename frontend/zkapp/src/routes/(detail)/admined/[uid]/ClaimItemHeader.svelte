<tr class="text-start border-0 border-secondary-subtle border-bottom">
  <th class="border border-secondary-subtle">
    State
  <!-- </th>

  <th class="border border-secondary-subtle"> -->
    Applicant / Project
  </th>
 {#if ((columns || []).length > 0)}
  {#each columns as col}
    <th class="ps-3 pb-2 border  border-secondary-subtle">
      {fields[col].label}
    </th>
  {/each}
  {/if}
</tr>

<script>
  export let fields, columns=[];
</script>