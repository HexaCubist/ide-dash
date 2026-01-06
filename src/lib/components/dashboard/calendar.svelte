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
          // debugger;
          // showCalendar = false;
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

<div class="calendar transition" class:opacity-0={!showCalendar}>
  <div bind:this={calendarContainer}></div>
</div>

<style lang="postcss">
  .calendar {
    @apply p-8 backdrop-blur-lg bg-black bg-opacity-50 rounded-box shadow-lg shrink grow basis-0;
    & :global(.fc-scroller) {
      @apply overflow-hidden !important;
    }
  }
</style>
