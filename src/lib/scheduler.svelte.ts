import type { ScreenData } from "./screens.svelte";

const start_date = new Date(0);

const priority_map = {
  low: 1,
  med: 2,
  high: 3,
  vhigh: 5,
  infinite: 1000,
} as const;

export class scheduleItem {
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
  isShowing = $derived.by(() => {
    return this.start <= this.schedule.now && this.end >= this.schedule.now;
  });
}

export class schedule {
  public now: Date;
  seconds_since_start: number;
  cycles: number;
  cycle_start: Date;
  schedule_items: scheduleItem[];
  current: scheduleItem | undefined;
  constructor(public screens: ScreenData[], public default_duration = 60) {
    this.schedule_items = screens.map(
      (screen) => new scheduleItem(screen, this)
    );
    // Default duration is 60s
    // Start by calculating total duration of all screens
    const total_duration = screens.reduce(
      (acc, screen) => acc + default_duration * priority_map[screen.priority],
      0
    );
    // Calculate seconds since now
    this.now = $state(new Date());
    this.seconds_since_start = $derived(
      (this.now.getTime() - start_date.getTime()) / 1000
    );
    // Calculate how many cycles have passed
    this.cycles = Math.floor(this.seconds_since_start / total_duration);
    // Calculate the current cycle's start time
    this.cycle_start = new Date(
      start_date.getTime() + this.cycles * total_duration * 1000
    );
    this.current = $derived.by(() => {
      return this.schedule_items.find((item) => item.isShowing);
    });
    // Start timer to update now
    setInterval(() => {
      this.now = new Date();
    }, 1000);
  }
}
