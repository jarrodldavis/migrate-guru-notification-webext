<script>
  import { STATUS } from '../constants';
  import Status from '../shared/status.svelte';
  import Message from '../shared/message.svelte';

  export let name;
  export let status;
  export let url;

  $: not_started = status === STATUS.NOT_STARTED || status === STATUS.UNKNOWN;
  $: hostname = url ? new URL(url).hostname : null;
</script>

<div class="panel-list-item" class:disabled={not_started} on:click>
  {#if not_started}
    <span class="text"><Status {status} /></span>
  {:else}
    <span class="text">
      <span>
        {hostname}
      </span>
    </span>
  {/if}
  <span class="text-shortcut"><Message key={name} /></span>
</div>
