import { derived, writable } from "svelte/store";

interface holidayData {
  tags: string[];
  _id: string;
  name: string;
  month: number;
  day: number;
}

export const holidays = writable<holidayData[]>([]);

const holidayReq = fetch("https://todaysholiday.herokuapp.com/holidays").then(
  (res) => res.json()
);

holidayReq.then((data) => {
  holidays.set(data);
});

export const currentHolidays = derived(
  holidays,
  ($holidays) => {
    const today = new Date();
    const month = today.getMonth();
    const day = today.getDate();
    return $holidays.filter((holiday) => {
      return holiday.month === month && holiday.day === day;
    });
  },
  []
);
