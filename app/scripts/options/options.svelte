<script>
  import { create_setting_store } from '../shared/settings';

  import Message from '../shared/message.svelte';

  const notifications = create_setting_store('notifications', true);
  const favicons = create_setting_store('favicons', true);
</script>

<svelte:head>
  {#if process.env.VENDOR !== 'firefox'}
    <link rel="stylesheet" href="../styles/extension.css" />
  {/if}
</svelte:head>

<div class="panel">
  <div class="panel-section panel-section-formElements">
    <div class="panel-formElements-item browser-style">
      <input id="notifications" type="checkbox" bind:checked={$notifications} />
      <label for="notifications" class="browser-style-label">
        <Message key="optionsNotifications" />
      </label>
    </div>
    <div class="panel-formElements-item browser-style">
      <input id="favicons" type="checkbox" bind:checked={$favicons} />
      <label for="favicons" class="browser-style-label">
        <Message key="optionsFavicons" />
      </label>
    </div>
  </div>
</div>
