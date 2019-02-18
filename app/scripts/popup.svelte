<svelte:head>
  {#if process.env.VENDOR !== 'firefox'}
    <link rel="stylesheet" href="../styles/extension.css" />
  {/if}
</svelte:head>

<div class="panel">
  <div class="panel-section panel-section-header">
    <img class="icon-section-header" src={icon('POPUP_HEADER')} alt="Header Icon" />
    <div class="text-section-header">{i18n('popupHeader')}</div>
  </div>

  <div class="panel-section panel-section-list">
    <div class="panel-list-item disabled">
      <span class="text">{displayStatus}</span>
      <span class="text-shortcut">{i18n('popupStatusListItem')}</span>
    </div>

    <div class="panel-section-separator"></div>

    <div class="panel-list-item" class:disabled="notStarted" on:click="open(source)">
      {#if notStarted}
        <span class="text">{displayStatus}</span>
      {:else}
        <span class="text">{hostname(source)}</span>
      {/if}
      <span class="text-shortcut">{i18n('popupSourceListItem')}</span>
    </div>
    <div class="panel-list-item" class:disabled="notStarted" on:click="open(destination)">
      {#if notStarted}
        <span class="text">{displayStatus}</span>
      {:else}
        <span class="text">{hostname(destination)}</span>
      {/if}
      <span class="text-shortcut">{i18n('popupDestinationListItem')}</span>
    </div>

    <div class="panel-section-separator"></div>

    <div class="panel-list-item">
      <span class="text">{i18n('popupNotificationListItem')}</span>
      <span class="text-shortcut">{optionStatus(notifications)}</span>
    </div>
    <div class="panel-list-item">
      <span class="text">{i18n('popupFaviconListItem')}</span>
      <span class="text-shortcut">{optionStatus(favicons)}</span>
    </div>
  </div>

  <div class="panel-section panel-section-footer">
    <div class="panel-section-footer-button" class:disabled="notStarted" on:click="open(source)">
      {i18n('popupSourceButton')}
    </div>
    <div class="panel-section-footer-separator"></div>
    <div class="panel-section-footer-button default" class:disabled="notStarted" on:click="open(destination)">
      {i18n('popupDestinationButton')}
    </div>
  </div>
</div>

<script>
  import { STATUS } from './constants';
  import { outputs as icons } from '../images.json';

  const i18nStatuses = {
    [STATUS.NOT_STARTED]: 'statusNotStarted',
    [STATUS.IN_PROGRESS]: 'statusInProgress',
    [STATUS.SUCCESS]: 'statusSuccess',
    [STATUS.FAILURE]: 'statusFailure',
  }

  export default {
    async oncreate() {
      const [{ id: tabId }] = await browser.tabs.query({ currentWindow: true, active: true });
      const { status, source, destination } = await browser.tabs.sendMessage(tabId, null);
      this.set({ tabId, status, source, destination });

      browser.runtime.onMessage.addListener(({ status, source, destination }, { tab: { id: tabId } = {} }) => {
        if (tabId !== this.get().tabId) {
          return;
        }

        this.set({ status, source, destination });
      });

      this.set(await browser.storage.local.get({ notifications: true, favicons: true }));

      browser.storage.onChanged.addListener(({ notifications, favicons }) => {
        this.set({
          notifications: notifications.newValue,
          favicons: favicons.newValue,
        })
      });
    },
    helpers: {
      process,
      icon(name) {
        return browser.runtime.getURL(icons[name].filePath);
      },
      i18n(messageName) {
        return browser.i18n.getMessage(messageName);
      },
      hostname(url) {
        return new URL(url).hostname;
      },
      optionStatus(isEnabled) {
        return browser.i18n.getMessage(isEnabled ? 'popupEnabledListItem' : 'popupDisabledListItem');
      }
    },
    data() {
      return {
        tabId: null,
        status: STATUS.NOT_STARTED,
        source: null,
        destination: null,
        notifications: true,
        favicons: true
      }
    },
    computed: {
      notStarted({ status }) {
        return status === STATUS.NOT_STARTED;
      },
      displayStatus({ status }) {
        return browser.i18n.getMessage(i18nStatuses[status]);
      }
    },
    methods: {
      open(url) {
        const { notStarted, tabId: openerTabId } = this.get();

        if (notStarted) {
          return;
        }

        browser.tabs.create({ url, openerTabId })
      }
    }
  }
</script>
