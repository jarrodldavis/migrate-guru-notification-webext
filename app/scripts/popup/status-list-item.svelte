<script>
  import Status from '../shared/status.svelte';
  import Message from '../shared/message.svelte';

  export let status;
</script>

<div class="panel-list-item disabled">
  <span class="text">
    <Status {status} />
  </span>
  <span class="text-shortcut">
    <Message key="popupStatusListItem" />
  </span>
</div>
