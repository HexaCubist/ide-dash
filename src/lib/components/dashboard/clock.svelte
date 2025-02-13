<script lang="ts">
  import { currentHolidays, holidays } from "$lib/holidays";
  import moment from "moment";

  let time = $state(moment());
  setInterval(() => {
    time = moment();
  }, 1000);
</script>

<div class="time">
  <p class="text-4xl font-bold leading-5 my-0">
    {time.format("LTS")}
  </p>
  <p class="text-md mb-1 italic font-light tracking-wider">
    {time.format("LL")}
  </p>
  <p class=" max-w-60 text-xs">
    Today is:
    {#each $currentHolidays as hol, i}
      <span class="font-bold">{hol.name}</span
      >{#if i === $currentHolidays.length - 2}
        &nbsp;and&nbsp;
      {/if}{#if i < $currentHolidays.length - 2},&nbsp;{/if}
    {/each}
  </p>
</div>

<style lang="postcss">
  .time {
    @apply fixed p-8 rounded-br-box shadow-md shadow-[#0003] backdrop-blur-lg bg-black bg-opacity-50 text-left;
    font-variant-numeric: tabular-nums;
  }
</style>
