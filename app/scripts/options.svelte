<svelte:head>
  {#if process.env.VENDOR !== 'firefox'}
    <link rel="stylesheet" href="../styles/extension.css" />
  {/if}
</svelte:head>

<div class="panel">
  <div class="panel-section panel-section-formElements" on:change="save()">
    <div class="panel-formElements-item browser-style">
      <input id="notifications" type="checkbox" bind:checked=notifications />
      <label for="notifications" class="browser-style-label">{i18n('optionsNotifications')}</label>
    </div>
    <div class="panel-formElements-item browser-style">
      <input id="favicons" type="checkbox" bind:checked=favicons />
      <label for="favicons" class="browser-style-label">{i18n('optionsFavicons')}</label>
    </div>
  </div>
</div>

<script>
  import { outputs as icons } from '../images.json';

  function data() {
    return {
      notifications: true,
      favicons: true
    }
  }

  export default {
    async oncreate() {
      this.set(await browser.storage.local.get(data()));
    },
    helpers: {
      process,
      i18n(messageName) {
        return browser.i18n.getMessage(messageName);
      }
    },
    data,
    methods: {
      async save() {
        await browser.storage.local.set(this.get());
      }
    }
  }
</script>
