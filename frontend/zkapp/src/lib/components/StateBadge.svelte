<Badge pill color={COLORS[state]} class="p-1 px-2 lh-base">
  {ALL_STATES[state] || ""}
</Badge>

<script>
  import { Badge } from "sveltestrap";
  import { ALL_STATES } from "@socialcap/contracts";

  export let state; 

  const COLORS = {
    0: "white", // NONE",
    1: "secondary", // DRAFT",   
    2: "gray", // CANCELED",   
    3: "danger", // REVISION",    
    4: "info", // CLAIMED",   
    6: "primary", // VOTING",
    7: "warning", // ASSIGNED",
    8: "success", // ACTIVE",
    9: "warning", // WAITING",
    10: "primary", // DONE",
    11: "light", // IGNORED", // will not do this 
    12: "danger", // UNPAID
    19: "danger", // REJECTED",   
    20: "success", // APPROVED"
  }
</script>
