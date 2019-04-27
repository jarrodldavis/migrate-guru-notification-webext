<script>
  import FormItem from './form-item.svelte';
</script>

<svelte:head>
  {#if process.env.VENDOR !== 'firefox'}
    <link rel="stylesheet" href="../styles/extension.css" />
  {/if}
</svelte:head>

<div class="panel">
  <div class="panel-section panel-section-formElements">
    <FormItem name="optionsNotifications" setting="notifications" />
    <FormItem name="optionsFavicons" setting="favicons" />
  </div>
</div>
