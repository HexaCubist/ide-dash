<script lang="ts">
  import { env } from "$env/dynamic/public";
  import { getSRCSet, type ScreenData } from "$lib/screens.svelte.js";

  let {
    screen,
    override_src = {},
  }: {
    screen: Pick<ScreenData, "Iframe_URL" | "Video" | "Image" | "content_type">;
    override_src?: Partial<{
      image: string;
      video: string;
      iframe: string;
    }>;
  } = $props();

  let currentTime = $state(new Date().toLocaleTimeString());
  setInterval(() => {
    currentTime = new Date().toLocaleTimeString();
  }, 1000);
</script>

{#if screen.content_type === "iframe" && (screen.Iframe_URL || override_src.iframe)}
  <iframe
    src={override_src.iframe || screen.Iframe_URL}
    title=""
    class="w-full h-full"
    frameborder="0"
    width="100%"
    height="100%"
  ></iframe>
{:else if screen.content_type === "image" && (override_src.image || screen.Image)}
  <img
    src={override_src.image || getSRCSet(screen.Image!.id)["escreen"]}
    alt=""
    class="w-full h-full object-cover"
  />
{:else if screen.content_type === "video" && (override_src.video || screen.Video)}
  {#if override_src.video}
    <iframe
      src={override_src.video}
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      class="pointer-events-none aspect-video h-full w-full"
      title=""
    ></iframe>
  {:else if screen.Video?.service === "youtube"}
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${screen.Video.id}?playlist=${screen.Video.id}&autoplay=1&loop=1&controls=0&mute=1&iv_load_policy=3&rel=0`}
      frameborder="0"
      allow="autoplay; encrypted-media"
      allowfullscreen
      class="pointer-events-none aspect-video h-full w-full"
      title=""
    ></iframe>
  {:else if screen.Video?.service === "vimeo"}
    <iframe
      src={`https://player.vimeo.com/video/${screen.Video.id}?autoplay=1&loop=1&title=0&byline=0&portrait=0`}
      frameborder="0"
      allow="autoplay; fullscreen"
      allowfullscreen
      class="pointer-events-none aspect-video h-full w-full"
      title=""
    ></iframe>
  {:else if screen.Video?.id}
    <video
      src={`${env.PUBLIC_CDN_URL}/${screen.Video.id}`}
      class="h-full w-full aspect-video object-cover"
      autoplay
      loop
      muted
    ></video>
  {/if}
{:else}
  <div class="w-full h-full flex justify-center items-center flex-col">
    <p class="block text-xl font-bold">Content not supported yet.</p>
    <p class="block">IDE Notice Board Screen. Current time: {currentTime}</p>
  </div>
{/if}
