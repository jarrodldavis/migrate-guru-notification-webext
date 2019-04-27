<script>
  import { outputs as icons } from '../../images.json';

  export let name;

  let icon;
  $: {
    if (name in icons) {
      icon = icons[name];
    } else {
      throw new Error(`Unknown icon ${name}`);
    }
  }

  $: url = browser.runtime.getURL(icon.filePath);
</script>

<img {...$$props} src={url} />
