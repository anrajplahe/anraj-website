
"use client";

import { useState } from "react";

export default function JournalDateTimeFields() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  function fillNow() {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");

    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");

    setDate(`${year}-${month}-${day}`);
    setTime(`${hours}:${minutes}`);
  }

  return (
    <div className="space-y-3">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm text-gray-400">
          Journal date *
          <input
            type="date"
            name="journalDate"
            required
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-lg border border-white/15 bg-[#161A22] px-3 py-3 text-white focus:border-green-400 focus:outline-none"
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-gray-400">
          Time (optional)
          <input
            type="time"
            name="journalTime"
            value={time}
            onChange={(event) => setTime(event.target.value)}
            className="rounded-lg border border-white/15 bg-[#161A22] px-3 py-3 text-white focus:border-green-400 focus:outline-none"
          />
        </label>
      </div>

      <button
        type="button"
        onClick={fillNow}
        className="text-sm font-medium text-green-400 transition-colors hover:text-green-300"
      >
        Now — use current date and time
      </button>
    </div>
  );
}
