<script>
  import { STATUS } from '../constants.json';

  import { create_migration_store } from './migration';

  import Header from './header.svelte';
  import StatusListItem from './status-list-item.svelte';
  import HostnameListItem from './hostname-list-item.svelte';
  import OptionListItem from './option-list-item.svelte';
  import Button from './button.svelte';

  const migration = create_migration_store();
  $: status = $migration.status;
  $: source = $migration.source;
  $: destination = $migration.destination;
  $: not_started = status === STATUS.NOT_STARTED || status === STATUS.UNKNOWN;

  function open(url) {
    if (not_started) {
      return;
    }

    browser.tabs.create({ url, openerTabId: $migration.tab_id })
  }

  function open_source() {
    open(source);
  }

  function open_destination() {
    open(destination);
  }
</script>

<svelte:head>
  {#if process.env.VENDOR !== 'firefox'}
    <link rel="stylesheet" type="text/css" href="../styles/extension.css" />
  {/if}
  <link rel="stylesheet" type="text/css" href="../styles/popup.css">
</svelte:head>

<div class="panel">
  <Header />

  <div class="panel-section panel-section-list">
    <StatusListItem {status} />

    <div class="panel-section-separator"></div>

    <HostnameListItem name="popupSourceListItem" {status} url={source} on:click={open_source} />
    <HostnameListItem name="popupDestinationListItem" {status} url={destination} on:click={open_destination} />

    <div class="panel-section-separator"></div>

    <OptionListItem name="popupNotificationListItem" setting="notifications" />
    <OptionListItem name="popupFaviconListItem" setting="favicons" />
  </div>

  <div class="panel-section panel-section-footer">
    <Button name="popupSourceButton" {status} on:click={open_source} />
    <div class="panel-section-footer-separator"></div>
    <Button name="popupDestinationButton" {status} primary on:click={open_destination} />
  </div>
</div>
