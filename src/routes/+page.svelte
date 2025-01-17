<script lang="ts">
  import { browser } from "$app/environment";
  import { invalidateAll } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import { getSRCSet } from "$lib/screens.svelte.js";

  let { data } = $props();
  const screen = $derived(data.currentScreen);

  let currentTime = $state(new Date().toLocaleTimeString());
  setInterval(() => {
    currentTime = new Date().toLocaleTimeString();
  }, 1000);

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
  {#if screen.Iframe_URL}
    <iframe
      src={screen.Iframe_URL}
      title=""
      class="w-screen h-screen"
      frameborder="0"
      width="100%"
      height="100%"
    ></iframe>
  {:else if screen.Image}
    <img
      src={getSRCSet(screen.Image.id).original}
      alt=""
      class="w-screen h-screen object-cover"
    />
  {:else if screen.Video}
    {#if screen.Video.service === "youtube"}
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${screen.Video.id}?playlist=${screen.Video.id}&autoplay=1&loop=1&controls=0&mute=1&iv_load_policy=3&rel=0`}
        frameborder="0"
        allow="autoplay; encrypted-media"
        allowfullscreen
        class="pointer-events-none absolute inset-0 h-full w-full"
        title=""
      ></iframe>
    {:else if screen.Video.service === "vimeo"}
      <iframe
        src={`https://player.vimeo.com/video/${screen.Video.id}?autoplay=1&loop=1&title=0&byline=0&portrait=0`}
        frameborder="0"
        allow="autoplay; fullscreen"
        allowfullscreen
        class="pointer-events-none absolute inset-0 h-full w-full"
        title=""
      ></iframe>
    {:else if screen.Video.id}
      <video
        src={`${env.PUBLIC_CDN_URL}/${screen.Video.id}`}
        class="absolute inset-0 h-full w-full object-cover"
        autoplay
        loop
        muted
      ></video>
    {/if}
  {:else}
    <div class="w-screen h-screen flex justify-center items-center flex-col">
      <p class="block text-xl font-bold">Content not supported yet.</p>
      <p class="block">IDE Notice Board Screen. Current time: {currentTime}</p>
    </div>
  {/if}
{:else}
  <div class="w-screen h-screen flex justify-center items-center flex-col">
    <p class="block text-xl font-bold">No Screens Published.</p>
    <p class="block">IDE Notice Board Screen. Current time: {currentTime}</p>
  </div>
{/if}
