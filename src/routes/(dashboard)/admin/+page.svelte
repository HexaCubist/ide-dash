<script lang="ts">
  import ScreenSelector from "$lib/components/screenSelector.svelte";
  import type { ScreenData } from "$lib/screens.svelte.js";

  let { data } = $props();

  let dirtyState: false | ScreenData[] = $state(false);
</script>

<div class="card">
  <h1 class="text-4xl font-bold">Screen Config</h1>
  <p class="text-gray-600 mb-4">
    Drag and drop to reorder screens. Click on a screen to edit. Screens will
    play in the scheduled order, with weighting applied for time.
  </p>
  <div class="rounded-lg shadow-md flex w-full bg-white mb-4 items-center">
    <div class="px-2">
      {#if dirtyState}
        <strong>Warning:</strong> You have unsaved changes.
      {:else}
        <strong>Changes Saved</strong>
      {/if}
    </div>
    <div class="grow"></div>
    <div class="flex gap-2 p-2">
      <form method="POST">
        <input
          type="hidden"
          name="screenList"
          value={JSON.stringify(dirtyState)}
        />
        <button class="btn" disabled={!dirtyState}> Save </button>
      </form>
    </div>
  </div>

  <ScreenSelector
    screens={data.screenList}
    update={(screens) => {
      dirtyState = screens;
    }}
  />
</div>

<style lang="postcss">
  .card {
    @apply rounded-xl shadow-md bg-white p-4 bg-opacity-90 backdrop-blur-lg brightness-125 h-full;
  }
</style>
