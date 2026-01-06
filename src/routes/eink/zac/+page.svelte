<script lang="ts">
  import { browser, dev } from "$app/environment";
  import { invalidateAll } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { env } from "$env/dynamic/public";
  import Calendar from "$lib/components/dashboard/calendar.svelte";
  import Clock from "$lib/components/dashboard/clock.svelte";
  import QrCode from "$lib/components/dashboard/qrCode.svelte";
  import Screen from "$lib/components/dashboard/screen.svelte";
  import Sidebar from "$lib/components/dashboard/sidebar.svelte";
  import { Schedule } from "$lib/scheduler.svelte.js";
  import { getSRCSet } from "$lib/screens.svelte.js";

  let { data } = $props();
  const schedule = new Schedule(data.screenList);
  const current = $derived(schedule.current);
  const screen = $derived(current?.screen);
  let projects = $derived(data.projects.projects);
  let allTasks = $derived(
    Object.values(projects).flatMap((p) => p.tasks || [])
  );

  // let taskEls = $state<Record<string, HTMLInputElement>>({});
  // $effect(() => {
  //   Object.entries(taskEls).forEach(([id, el]) => {
  //     const task = allTasks.find((at) => at.id === id);
  //     if (!task || !el) return;
  //     el.indeterminate = task.status === "In Progress" ? true : false;
  //   });
  // });

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

<Clock mode="eink" />
<Sidebar>
  <Calendar />
  {#if Object.values(projects).some((p) => p.tasks && p.tasks.length > 0)}
    <div class="card">
      {#each Object.entries(projects) as [projectId, project] (projectId)}
        {#if project.tasks && project.tasks.length > 0}
          <div class="mb-4">
            <h2 class="text-lg font-bold mb-2">{project.name}</h2>
            <ul class="flex flex-col gap-2">
              {#each project.tasks as task (task.id)}
                <li
                  class="flex flex-row gap-2"
                  class:opacity-50={task.status === "Not Started"}
                >
                  <div class="rounded-btn avatar aspect-square p-1">
                    <Icon
                      icon={task.status === "In Progress"
                        ? "ri:progress-5-line"
                        : "ri:progress-1-line"}
                      class="w-full max-w-32 h-auto"
                    />
                  </div>
                  <div>
                    {task.name}
                  </div>
                </li>
              {/each}
            </ul>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</Sidebar>

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

<style lang="postcss">
  :global(body) {
    --fc-now-indicator-color: #fff !important;
    --bc: 100% 0.032349 68.908445 !important;
  }
  .card {
    @apply p-8 backdrop-blur-lg bg-black bg-opacity-50 rounded-box shadow-lg shrink grow basis-0;
    & :global(.fc-scroller) {
      @apply overflow-hidden !important;
    }
  }
</style>
