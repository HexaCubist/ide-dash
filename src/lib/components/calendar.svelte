<script lang="ts">
  import { Calendar } from "@fullcalendar/core";
  import timeGridPlugin from "@fullcalendar/timegrid";
  import iCalendarPlugin from "@fullcalendar/icalendar";
  import { getContext, onMount } from "svelte";
  import { env } from "$env/dynamic/public";
  import { base } from "$app/paths";
  import { fade } from "svelte/transition";

  const numIcals = getContext("num_icals");

  let calendarContainer: HTMLDivElement | undefined = $state();
  let showCalendar = $state(true);

  onMount(() => {
    if (calendarContainer) {
      const calendar = new Calendar(calendarContainer, {
        plugins: [timeGridPlugin, iCalendarPlugin],
        headerToolbar: {
          start: "title",
          center: "",
          end: "",
        },
        initialView: "timeGridTwoDay",
        nowIndicator: true,
        height: "100%",
        views: {
          timeGridTwoDay: {
            type: "timeGrid",
            duration: { days: 2 },
          },
        },
        eventSources: [
          ...[...Array(numIcals).keys()].map((i) => {
            return {
              url: `${base}/api/cal/${i}`,
              format: "ics",
            };
          }),
        ],
      });
      calendar.on("eventsSet", () => {
        if (calendar.getEvents().length === 0) {
          showCalendar = false;
        } else {
          showCalendar = true;
        }
      });
      calendar.render();
      setInterval(() => {
        if (showCalendar) calendar.scrollToTime(Date.now());
      }, 100);
    }
  });
</script>

{#if showCalendar}
  <div class="sidebar" transition:fade|global>
    <div bind:this={calendarContainer}></div>
  </div>
{/if}

<style lang="postcss">
  .sidebar {
    @apply absolute z-10 p-8 backdrop-blur-lg bg-black bg-opacity-50 rounded-box shadow-lg;
    --padding: 1rem;
    top: var(--padding);
    right: var(--padding);
    bottom: var(--padding);
    width: 30rem;
    min-width: calc(40% - (var(--padding)));
    max-width: calc(100vw - (var(--padding) * 2));
    & :global(.fc-scroller) {
      @apply overflow-hidden !important;
    }
  }
</style>
