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
    //@ts-ignore
    HSStaticMethods.autoInit();
  });
</script>

<svelte:head>
  <title>IDE Dashboard</title>
  <meta property="og:title" content="IDE Dashboard" />
  <meta property="og:image" content="/cover.jpg" />
  <link rel="icon" type="image/png" href="/favicon-96x96.png" sizes="96x96" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="shortcut icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
  <meta name="apple-mobile-web-app-title" content="IDE Dash" />
  <link rel="manifest" href="/site.webmanifest" />
</svelte:head>

{@render children()}
