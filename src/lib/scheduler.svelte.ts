import moment from "moment";
import type { ScreenData } from "./screens.svelte";

const start_date = new Date(0);

const priority_map = {
  low: 1,
  medium: 2,
  high: 3,
  vhigh: 5,
  infinite: 1000,
} as const;

export class ScheduleItem {
  constructor(public screen: ScreenData, public schedule: schedule) {}
  index = $derived.by(() => {
    return this.schedule.schedule_items.indexOf(this);
  });
  duration = $derived.by(() => {
    return this.schedule.default_duration * priority_map[this.screen.priority];
  });
  previous = $derived.by(() => {
    if (this.index === 0) {
      return this.schedule.schedule_items[
        this.schedule.schedule_items.length - 1
      ];
    }
    return this.schedule.schedule_items[this.index - 1];
  });
  next = $derived.by(() => {
    if (this.index === this.schedule.schedule_items.length - 1) {
      return this.schedule.schedule_items[0];
    }
    return this.schedule.schedule_items[this.index + 1];
  });
  start = $derived.by(() => {
    const screens_before = this.schedule.schedule_items.slice(0, this.index);
    const total_duration = screens_before.reduce(
      (acc, screen) => acc + screen.duration,
      0
    );
    return new Date(
      this.schedule.cycle_start.getTime() + total_duration * 1000
    );
  });
  end = $derived.by(() => {
    return new Date(this.start.getTime() + this.duration * 1000);
  });
  time_left = $derived.by(() => {
    return (this.end.getTime() - this.schedule.now.getTime()) / 1000;
  });
  isShowing = $derived.by(() => {
    return this.start <= this.schedule.now && this.end >= this.schedule.now;
  });
}

export class Schedule {
  /** Scheduler: Manages what screens are showing at any given time
   * @param screens List of screens to show
   * @param default_duration Default duration for each screen
   */
  public now: Date = $state(new Date());

  screens: ScreenData[] = $state([]);
  default_duration = $state(60);
  total_duration = $derived(
    this.screens.reduce(
      (acc, screen) =>
        acc + this.default_duration * priority_map[screen.priority],
      0
    )
  );
  schedule_items = $derived(
    this.screens.map((screen) => new ScheduleItem(screen, this))
  );
  seconds_since_start = $derived(
    (this.now.getTime() - start_date.getTime()) / 1000
  );
  cycles = $derived(Math.floor(this.seconds_since_start / this.total_duration));
  cycle_start = $derived(
    new Date(start_date.getTime() + this.cycles * this.total_duration * 1000)
  );
  current = $derived.by(() => {
    return this.schedule_items.find((item) => item.isShowing);
  });

  constructor(screens: ScreenData[], default_duration = 60) {
    this.default_duration = default_duration;
    this.screens = screens.filter(
      (screen) =>
        (!screen.schedule_end ||
          moment(screen.schedule_end).isAfter(moment())) &&
        (!screen.schedule_start ||
          moment(screen.schedule_start).isBefore(moment()))
    );
    // Start timer to update now
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
}
