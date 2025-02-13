<script lang="ts">
  import Sortable from "sortablejs";

  import type { ScreenData } from "$lib/screens.svelte";
  import Screen from "./dashboard/screen.svelte";
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
    <a
      class="cursor-pointer card card-compact sm:max-w-sm light bg-base-200 hover:scale-95 transition"
      id={screen.id}
      href="/admin/screen/{screen.id}/"
    >
      <figure class="aspect-video pointer-events-none">
        <Screen {screen} />
      </figure>
      <div class="card-body">
        <p>
          {screen.Name}
        </p>
      </div>
    </a>
  {/each}
</div>

<style lang="postcss">
</style>
