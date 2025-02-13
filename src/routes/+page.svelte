<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { invalidateAll } from "$app/navigation";
  import { env } from "$env/dynamic/public";
  import Calendar from "$lib/components/dashboard/calendar.svelte";
  import Clock from "$lib/components/dashboard/clock.svelte";
  import QrCode from "$lib/components/dashboard/qrCode.svelte";
  import Screen from "$lib/components/dashboard/screen.svelte";
  import { Schedule } from "$lib/scheduler.svelte.js";
  import { getSRCSet } from "$lib/screens.svelte.js";

  let { data } = $props();
  const schedule = new Schedule(data.screenList);
  const current = $derived(schedule.current);
  const screen = $derived(current?.screen);

  // Fully Refresh page after 2 hours
  if (browser)
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

<div class="absolute top-4 left-4">
  <div
    class="radial-progress opacity-30"
    style:--value={schedule.current
      ? (schedule.current.time_left / schedule.current.duration) * 100
      : 0}
    style:--size="2rem"
    role="progressbar"
    aria-label="Radial Progress"
  ></div>
</div>

{#if !screen?.foreground || dev}
  <Clock />
  <Calendar />
  <QrCode />
{/if}

{#if screen}
  <div class="h-screen">
    <Screen {screen} />
  </div>
{:else}
  <div class="w-screen h-screen flex justify-center items-center flex-col">
    <p class="block text-xl font-bold">No Screens Published.</p>
    <p class="block">IDE Notice Board Screen.</p>
  </div>
{/if}
