<Badge pill color={COLORS[role]} class="px-2 py-1 lh-base fs-sm">
  {ALL_ROLES[role] || ""}
</Badge>

<script>
  import { Badge } from "sveltestrap";
  import { ALL_ROLES } from "@models/roles";

  export let role; 

  const COLORS = {
    0: "primary", // NONE",
    1: "secondary", // PLAIN,   
    2: "info", // VALIDATOR",   
    3: "danger", // AUDITOR or JUDGE",    
  }
</script>
