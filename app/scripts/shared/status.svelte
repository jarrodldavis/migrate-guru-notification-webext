<script>
  import Message from '../shared/message.svelte';
  import { STATUS } from '../constants.json';

  export let status;

  const statuses = {
    [STATUS.UNKNOWN]: 'statusUnknown',
    [STATUS.NOT_STARTED]: 'statusNotStarted',
    [STATUS.IN_PROGRESS]: 'statusInProgress',
    [STATUS.SUCCESS]: 'statusSuccess',
    [STATUS.FAILURE]: 'statusFailure',
  };

  let key;
  $: {
    if (status in statuses) {
      key = statuses[status];
    } else {
      throw new Error(`Unknown status ${status}`);
    }
  }
</script>

<Message {key} />
