<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import "../app.postcss";
  import { onMount } from "svelte";

  let { children, data } = $props();

  let hasLoaded = false;

  afterNavigate(async (navType) => {
    if (!hasLoaded) {
      await import("flyonui/flyonui.js");
      hasLoaded = true;
    }
    // Runs after navigating between pages
    HSStaticMethods.autoInit();
  });
</script>

{@render children()}
