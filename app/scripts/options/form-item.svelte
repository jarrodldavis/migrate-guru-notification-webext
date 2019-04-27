<script>
  import { create_setting_store } from '../shared/settings';
  import Message from '../shared/message.svelte';

  export let name;
  export let setting;

  const value = create_setting_store(setting);
</script>

<div class="panel-formElements-item browser-style">
  <input id={setting} type="checkbox" bind:checked={$value} />
  <label for={setting} class="browser-style-label">
    <Message key={name} />
  </label>
</div>
