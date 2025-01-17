<script lang="ts">
  let { data } = $props();
  const screen = data.currentScreen;

  let currentTime = $state(new Date().toLocaleTimeString());
  setInterval(() => {
    currentTime = new Date().toLocaleTimeString();
  }, 1000);
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
