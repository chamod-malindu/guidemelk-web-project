"use client";

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * AvailabilityCalendar
 *
 * Props:
 *   bookings  – Array of booking objects from the API.
 *               Each has { date, duration, status }.
 *               Active statuses (pending, confirmed, completed) mark days as "booked".
 *   unavailableDates – Optional Set<string> of "YYYY-MM-DD" strings the guide
 *                      has manually marked unavailable.
 *   onToggleUnavailable – Optional callback(dateString) so the guide can click
 *                         a date to mark/unmark it unavailable.
 */
export default function AvailabilityCalendar({
  bookings = [],
  unavailableDates = new Set(),
  onToggleUnavailable,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // Navigate months
  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };
  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };
  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Build a Set of "YYYY-MM-DD" strings that are booked
  const bookedDates = useMemo(() => {
    const dates = new Set();
    const activeStatuses = ["pending", "confirmed", "completed"];

    bookings.forEach((booking) => {
      if (!activeStatuses.includes(booking.status)) return;

      const startDate = new Date(booking.date);
      const duration = booking.duration || 1;

      for (let i = 0; i < duration; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        // Format as YYYY-MM-DD
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
        dates.add(key);
      }
    });

    return dates;
  }, [bookings]);

  // Calendar grid calculations
  const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const today = new Date();
  const todayKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  // Build array of day cells (including leading blanks)
  const calendarCells = [];

  // Empty cells for days before the 1st
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarCells.push({ day: null, key: `empty-${i}` });
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const dateKey = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    const isBooked = bookedDates.has(dateKey);
    const isUnavailable = unavailableDates.has(dateKey);
    const isToday = dateKey === todayKey;
    const isPast = new Date(year, month, day) < new Date(today.getFullYear(), today.getMonth(), today.getDate());

    calendarCells.push({ day, dateKey, isBooked, isUnavailable, isToday, isPast });
  }

  const getDayClasses = (cell) => {
    const base = "text-center py-2 text-sm rounded-lg transition-colors relative";

    if (cell.isBooked) {
      return `${base} bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-medium cursor-default`;
    }
    if (cell.isUnavailable) {
      return `${base} bg-red-50 dark:bg-red-900/30 text-red-500 dark:text-red-400 font-medium ${onToggleUnavailable ? "cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/50" : "cursor-default"}`;
    }
    if (cell.isToday) {
      return `${base} bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-bold ring-2 ring-green-400 ${onToggleUnavailable && !cell.isPast ? "cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/50" : "cursor-default"}`;
    }
    if (cell.isPast) {
      return `${base} text-gray-300 dark:text-gray-600 cursor-default`;
    }
    return `${base} text-gray-800 dark:text-gray-200 ${onToggleUnavailable ? "cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`;
  };

  const handleDayClick = (cell) => {
    if (!onToggleUnavailable) return;
    if (cell.isBooked) return; // can't toggle booked days
    if (cell.isPast) return; // can't toggle past days
    onToggleUnavailable(cell.dateKey);
  };

  // Count stats for this month
  const bookedCount = calendarCells.filter((c) => c.day && c.isBooked).length;
  const unavailableCount = calendarCells.filter((c) => c.day && c.isUnavailable).length;
  const availableCount = daysInMonth - bookedCount - unavailableCount;

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <CardTitle>Availability Calendar</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={goToPrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium min-w-[130px] text-center dark:text-gray-200">
              {monthName}
            </span>
            <Button variant="outline" size="sm" onClick={goToNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={goToToday} className="text-xs">
              Today
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="text-center text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 py-1"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-4">
          {calendarCells.map((cell) =>
            cell.day === null ? (
              <div key={cell.key} />
            ) : (
              <div
                key={cell.dateKey}
                className={getDayClasses(cell)}
                onClick={() => handleDayClick(cell)}
                title={
                  cell.isBooked
                    ? "Booked"
                    : cell.isUnavailable
                    ? "Unavailable (click to toggle)"
                    : cell.isPast
                    ? "Past date"
                    : onToggleUnavailable
                    ? "Available (click to mark unavailable)"
                    : "Available"
                }
              >
                {cell.day}
              </div>
            )
          )}
        </div>

        {/* Legend + Stats */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm dark:text-gray-300">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded mr-2" />
            <span>Booked ({bookedCount})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-50 dark:bg-red-900/30 border border-red-300 dark:border-red-700 rounded mr-2" />
            <span>Unavailable ({unavailableCount})</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded mr-2" />
            <span>Available ({availableCount})</span>
          </div>
        </div>

        {onToggleUnavailable && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
            Click on available dates to toggle unavailability.
          </p>
        )}
      </CardContent>
    </Card>
  );
}