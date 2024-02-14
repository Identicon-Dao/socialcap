<div class="pt-3">
  <div class="text-end py-3 mx-4 d-flex justify-content-between align-items-center border-0 border-bottom">
        <Dropdown autoClose="inside" size="sm">
          Show &nbsp; <DropdownToggle class="--bg-light" caret>Columns</DropdownToggle>
          <DropdownMenu>
            {#each fields as field}
              {#if !field.isRemark}
                <DropdownItem>
                  <Input 
                    type="checkbox" 
                    label={field.label}
                    bind:checked={field.selected}
                  />
                </DropdownItem>  
              {/if}
            {/each}
          </DropdownMenu>
        </Dropdown>    
        
        <Button 
          on:click={() => submitAllVotes()}
          color="primary" size="" class="me-4">
          Submit your votes 
        </Button>
  </div>

  {#each data as task}
    <TaskItem uid={task.uid} columns={columns} bind:data={task}/>
  {/each}
</div>

<SubmitVotesDialog bind:open={openDlg} tasks={completedTasks}/>

<script>
  import { get } from "svelte/store";
  import { Button, Input } from "sveltestrap";
  import { Dropdown, DropdownItem,DropdownToggle, DropdownMenu } from "sveltestrap";
  import TaskItem from "./TaskItem.svelte";
  import SubmitVotesDialog from "./SubmitVotesDialog.svelte";
  import { deployedBatchVoting$ } from "$lib/contracts/stores";
  import { loadPlanVotingContract } from "$lib/contracts/batch-voting/loaders";
  import { connectWallet } from "$lib/contracts/wallet";
	import { ASSIGNED } from "@models/votes";

  export let data;

  let 
    columns = [],
    contains = "",
    orderBy = [],
    openDlg = false,
    completedTasks = [];
    
  let fields = prepareColumnsSelector(data);

  $: columns = filterSelected(fields);

  function prepareColumnsSelector(tasks) {
    if ((tasks || []).length === 0) 
      return;

    const firstParse = JSON.parse(tasks[0].claim.evidenceData);
    let evidenceData = (typeof(firstParse) === 'string') ? JSON.parse(firstParse) : firstParse;
    return evidenceData
      .map((t, j) => {
        return {
          label: t.label,
          index: j,
          isRemark: (t.type === 'remark'),
          selected: false
        }
      }) 
  }

  function filterSelected(fields) {
    let cols = fields.filter((t) => t.selected).map((t) => t.index);
    return cols;
  }

  
  async function submitAllVotes() {
    // here we should also prepare the tasks to send !
    let allTasks = (data || []).map((t) => {
      return {
        uid: t.uid,
        claimUid: t.claimUid,
        claimAccountId: t.claim.claimAccountId || "",
        result: t.result,
        assigneeUid: t.assigneeUid,
        communityUid: t.community.uid,
        planUid: t.plan.uid,
        applicant: t.applicant.fullName || ''
      }
    });

    // filter all the Not voted tasks, we only send the ones with results
    completedTasks = allTasks.filter((t) => t.result !== ASSIGNED+"");

    // check !
    let isSnarkyLoaded = get(deployedBatchVoting$) ;
    if (!isSnarkyLoaded) {
      // do this async ...
      // $$TODO$$ fails 
      //await loadPlanVotingContract();
      await connectWallet();
    }

    // now we can open the Dlg
    openDlg = true;
  }
</script>