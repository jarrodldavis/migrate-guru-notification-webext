<script>
  import { STATUS } from '../constants';

  import Message from '../shared/message.svelte';

  export let name;
  export let status;
  export let primary = false;

  $: not_started = status === STATUS.NOT_STARTED || status === STATUS.UNKNOWN;
</script>

<div class="panel-section-footer-button" class:disabled={not_started} class:default={primary} on:click>
  <Message key={name} />
</div>
