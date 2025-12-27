"use client";

import React from "react";
import { CalendarHijri } from "@/components/ui/calendar";
const Calendar = () => {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  return (
    <div>
      <CalendarHijri

      />
    </div>
  );
};
export default Calendar;
