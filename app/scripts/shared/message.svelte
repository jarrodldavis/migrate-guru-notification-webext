<script>
  export let key;

  let display_text;
  $: {
    if (key) {
      display_text = browser.i18n.getMessage(key);
    } else {
      throw new Error("Invalid key");
    }
  }
</script>

{display_text}
