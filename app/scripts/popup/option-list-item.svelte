<script>
  import { create_setting_store } from '../shared/settings';
  import Message from '../shared/message.svelte';

  export let name;
  export let setting;

  // stores can't be created in reactive declarations
  const enabled = create_setting_store(setting, true);

  $: value_message_key = $enabled ? 'popupEnabledListItem' : 'popupDisabledListItem';
</script>

<div class="panel-list-item">
  <span class="text"><Message key={name} /></span>
  <span class="text-shortcut"><Message key={value_message_key} /></span>
</div>
