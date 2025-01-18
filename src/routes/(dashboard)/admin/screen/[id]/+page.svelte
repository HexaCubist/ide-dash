<script lang="ts">
  import type { ScreenData } from "$lib/screens.svelte.js";
  import Screen from "$lib/components/screen.svelte";
  import { page } from "$app/state";
  import { error } from "@sveltejs/kit";
  const { id } = page.params;

  let { data } = $props();

  // Get selected screen
  const screen = data.screenList.find((screen) => screen.id == id);
  if (!screen) {
    error(404, "Screen not found");
  }

  let dirtyState: false | ScreenData[] = $state(false);
</script>

<div class="card">
  <div class="card-body">
    <h1 class="card-title flex">
      <p class="grow">Screen Editor</p>

      <a href="../" class="btn btn-text">
        <p class="icon-[tabler--arrow-left]"></p>
        Back
      </a>
    </h1>
    <div
      class="aspect-video max-w-xs mx-auto card overflow-clip pointer-events-none bg-white text-black"
    >
      {#if screen}
        <Screen {screen}></Screen>
      {/if}
    </div>
  </div>
</div>
