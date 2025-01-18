<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import "../app.postcss";

  let { children, data } = $props();

  afterNavigate(() => {
    // Runs after navigating between pages
    HSStaticMethods.autoInit();
  });
</script>

{@render children()}
