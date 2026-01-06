<script module lang="ts">
  export const modes = ["default", "eink"] as const;
  export type modeOptions = (typeof modes)[number];
</script>

<script lang="ts">
  import { page } from "$app/state";
  import moment from "moment";

  let { holidays } = page.data;

  let { mode } = $props<{ mode: modeOptions }>();

  let time = $state(moment());
  setInterval(() => {
    time = moment();
  }, 1000);
</script>

<div class="time">
  <p class="text-4xl font-bold leading-5 my-0">
    {#if mode === "eink"}
      {time.format("dddd")}
    {:else}
      {time.format("LTS")}
    {/if}
  </p>
  <p class="text-md mb-1 italic font-light tracking-wider">
    {time.format("LL")}
  </p>
  <p class=" max-w-60 text-xs">
    Today is:
    {#each holidays as hol, i}
      <span class="font-bold">{hol.name}</span>{#if i === holidays.length - 2}
        &nbsp;and&nbsp;
      {/if}{#if i < holidays.length - 2},&nbsp;{/if}
    {/each}
  </p>
</div>

<style lang="postcss">
  .time {
    @apply fixed p-8 rounded-br-box shadow-md shadow-[#0003] backdrop-blur-lg bg-black bg-opacity-50 text-left;
    font-variant-numeric: tabular-nums;
  }
</style>
