<div class="col-4">
    <StdFormField 
      label={label}
      type="select" 
      help={placeholder}
      class=""
      bind:value={value}
      options={options}
    />
  </div>

  <script>
    import StdFormField from "@components/forms/StdFormField.svelte";
    export let 
      value, label, options, placeholder;
  </script>