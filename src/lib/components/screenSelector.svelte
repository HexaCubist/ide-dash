<script lang="ts">
  import Sortable from "sortablejs";

  import type { ScreenData } from "$lib/screens.svelte";
  import Screen from "./screen.svelte";
  import { onMount } from "svelte";
  import { slide } from "svelte/transition";
  let {
    screens,
    update,
  }: { screens: ScreenData[]; update?: (screens: ScreenData[]) => void } =
    $props();

  let items: HTMLDivElement | undefined = $state();
  let sortable: Sortable | undefined = $state();
  onMount(() => {
    if (items) {
      sortable = new Sortable(items, {
        animation: 150,
        // handle: ".handle",
        onEnd: async (event) => {
          if (!items) return;
          const screenList = Array.from(items.children).map((item) => item.id);
          // Generate new order from screenList
          screenList.forEach((id, index) => {
            const screen = screens.find((screen) => screen.id == id);
            if (screen) {
              screen.sort = index;
              update && update(screens);
            }
          });
          console.log(screenList);
        },
      });
    }
  });
</script>

<div
  class="list grid grid-flow-row grid-cols-3 sm:grid-cols-3 gap-2 sm:gap-4"
  bind:this={items}
>
  {#each screens as screen}
    <div
      class="rounded-md overflow-clip w-full grow h-auto aspect-video relative bg-white screen cursor-pointer"
      id={screen.id}
    >
      <div class="pointer-events-none contents">
        <div class="overlay">
          <p>
            {screen.Name}
          </p>
        </div>
        <Screen {screen} />
      </div>
    </div>
  {/each}
</div>

<style lang="postcss">
  .overlay {
    @apply absolute bottom-0 w-full text-sm font-light bg-black py-2 text-white flex justify-center items-center;
  }
</style>
