<script lang="ts">
  import { browser } from "$app/environment";
  import { invalidateAll } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import Screen from "$lib/components/screen.svelte";
  import { getSRCSet } from "$lib/screens.svelte.js";

  let { data } = $props();
  const screen = $derived(data.currentScreen);

  // Fully Refresh page after 2 hours
  setInterval(
    () => {
      location.reload();
    },
    2 * 60 * 60 * 1000
  );

  // Check for content updates every 10 seconds
  setInterval(async () => {
    if (browser) {
      console.log("Invalidating...");
      await invalidateAll();
    }
  }, 20 * 1000);
</script>

{#if screen}
  <Screen {screen} />
{:else}
  <div class="w-screen h-screen flex justify-center items-center flex-col">
    <p class="block text-xl font-bold">No Screens Published.</p>
    <p class="block">IDE Notice Board Screen. Current time: {currentTime}</p>
  </div>
{/if}
