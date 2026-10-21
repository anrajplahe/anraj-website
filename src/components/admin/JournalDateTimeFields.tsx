
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
        className="
          inline-flex w-fit items-center gap-2
          rounded-lg border border-green-400/40
          bg-green-400/10 px-4 py-2.5
          text-sm font-medium text-green-400
          transition-colors duration-200
          hover:border-green-400 hover:bg-green-400/20
          focus-visible:outline-2
          focus-visible:outline-offset-2
          focus-visible:outline-green-400
        "
      >
        <span aria-hidden="true">◷</span>
        Now - use current date and time
      </button>

    </div>
  );
}
