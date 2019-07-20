module.exports = {
  sourceDir: './dist/firefox/',
  artifactsDir: './packages/',
  run: {
    pref: [
      'identity.fxaccounts.toolbar.accessed=true',
      'datareporting.policy.dataSubmissionPolicyBypassNotification=true',
      'browser.contentblocking.introCount=5'
    ],
    startUrl: ['about:devtools-toolbox?type=extension&id=migrate-guru-notification%40firefox-addons.jarrodldavis.com'],
    noReload: true
  },
  lint: {
    warningsAsErrors: true
  }
};
