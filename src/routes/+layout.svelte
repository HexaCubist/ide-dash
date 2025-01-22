<script lang="ts">
  import { browser } from "$app/environment";
  import { afterNavigate } from "$app/navigation";
  import "../app.postcss";
  import { onMount } from "svelte";
  import Dropzone from "dropzone";
  import _ from "lodash";

  let { children, data } = $props();

  let hasLoaded = false;

  afterNavigate(async (navType) => {
    if (!hasLoaded) {
      window.Dropzone = Dropzone;
      window._ = _;
      await import("flyonui/flyonui.js");
      hasLoaded = true;
    }
    // Runs after navigating between pages
    HSStaticMethods.autoInit();
  });
</script>

{@render children()}
