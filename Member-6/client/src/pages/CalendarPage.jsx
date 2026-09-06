import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function CalendarPage() {
  const { tasks, calendarEvents, addCalendarEvent, deleteCalendarEvent, loading } = useApp();

  // Always initialize the calendar using the real current date.
  const today = new Date();

  const [currentDate, setCurrentDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [selectedDay, setSelectedDay] = useState(today.getDate());

  // Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('reminder');
  const [color, setColor] = useState('#8B5CF6');

  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const monthNamesShort = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // Month navigation
  const handlePrevMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() - 1,
        1
      )
    );
    setSelectedDay(1);
  };

  const handleNextMonth = () => {
    setCurrentDate(
      new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        1
      )
    );
    setSelectedDay(1);
  };

  // Go to the real current date
  const handleToday = () => {
    const today = new Date();
    setCurrentDate(
      new Date(today.getFullYear(), today.getMonth(), 1)
    );
    setSelectedDay(today.getDate());
  };

  // Current calendar values
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const monthName = monthNames[month];
  const currentMonthShort = monthNamesShort[month];

  // Number of days in current month
  const daysInMonthCount = new Date(
    year,
    month + 1,
    0
  ).getDate();

  const daysInMonth = Array.from(
    { length: daysInMonthCount },
    (_, index) => index + 1
  );

  // Day of week the month starts on
  const firstDayIndex = new Date(
    year,
    month,
    1
  ).getDay();

  const pad = (number) => String(number).padStart(2, '0');

  const currentFormattedDate = `${year}-${pad(month + 1)}-${pad(
    selectedDay
  )}`;

  // Match task dates safely.
  const taskMatchesDate = (task, formattedDate, day) => {
    if (!task?.dueDate) {
      return false;
    }

    const dueDate = String(task.dueDate);

    // Handles YYYY-MM-DD
    if (dueDate.startsWith(formattedDate)) {
      return true;
    }

    // Handles dates such as "Sep 10"
    if (
      dueDate.includes(`${currentMonthShort} ${day}`) ||
      dueDate.includes(`${currentMonthShort} ${pad(day)}`)
    ) {
      return true;
    }

    return false;
  };

  const safeEvents = Array.isArray(calendarEvents) ? calendarEvents : [];
  const safeTasks = Array.isArray(tasks) ? tasks : [];

  // Events for selected day
  const selectedDayEvents = safeEvents.filter(
    (event) => event?.date && event.date.startsWith(currentFormattedDate)
  );

  // Tasks for selected day
  const selectedDayTasks = safeTasks.filter((task) =>
    taskMatchesDate(task, currentFormattedDate, selectedDay)
  );

  // Create personal calendar event via Context
  const handleCreateEvent = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      return;
    }

    try {
      await addCalendarEvent({
        title: title.trim(),
        date: currentFormattedDate,
        type,
        color,
      });

      setTitle('');
      setType('reminder');
      setColor('#8B5CF6');
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to create event:', error);
    }
  };

  // Delete personal calendar event via Context
  const handleDeleteEvent = async (id) => {
    try {
      await deleteCalendarEvent(id);
    } catch (error) {
      console.error('Failed to delete event:', error);
    }
  };

  return (
    <div className="flex flex-col w-full min-w-0 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Calendar & Reminders
          </h1>

          <p className="text-sm text-text-secondary mt-1">
            Manage your personal reminders, marks, and view deadlines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleToday}
            className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs text-text-primary font-medium hover:bg-cardHover cursor-pointer"
          >
            Today
          </button>

          <div className="flex items-center gap-1 bg-card border border-border rounded-xl p-1">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-cardHover rounded-lg text-text-muted cursor-pointer"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-semibold px-2 text-text-primary min-w-[110px] text-center">
              {monthName} {year}
            </span>

            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-cardHover rounded-lg text-text-muted cursor-pointer"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar + Details */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 items-start">
        {/* Calendar Grid */}
        <div className="xl:col-span-3 glass-card rounded-2xl border border-border bg-card overflow-hidden p-4">
          <div className="grid grid-cols-7 gap-px mb-2 text-center text-[10px] font-bold text-text-muted uppercase">
            {weekDays.map((day) => (
              <div key={day} className="py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-2">
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayIndex }).map((_, index) => (
              <div
                key={`empty-${index}`}
                className="min-h-[100px] rounded-xl border border-border/20 bg-card/20 opacity-30"
              />
            ))}

            {/* Days */}
            {daysInMonth.map((day) => {
              const formattedDate = `${year}-${pad(
                month + 1
              )}-${pad(day)}`;

              const dayEvents = safeEvents.filter(
                (event) => event?.date && event.date.startsWith(formattedDate)
              );

              const dayTasks = safeTasks.filter((task) =>
                taskMatchesDate(task, formattedDate, day)
              );

              const isSelected = day === selectedDay;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[100px] rounded-xl p-2 border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-purple bg-purple/5 shadow-purple-glow'
                      : 'border-border/50 bg-cardHover/30 hover:border-border'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold ${
                        isSelected
                          ? 'text-purple bg-purple/20 w-6 h-6 rounded-full flex items-center justify-center'
                          : 'text-text-primary'
                      }`}
                    >
                      {day}
                    </span>

                    {(dayEvents.length > 0 ||
                      dayTasks.length > 0) && (
                      <span className="text-[10px] bg-purple/10 text-purple px-1.5 py-0.5 rounded-full font-semibold">
                        {dayEvents.length + dayTasks.length}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1 mt-1 overflow-hidden">
                    {/* Task */}
                    {dayTasks.slice(0, 1).map((task) => (
                      <div
                        key={`task-${task.id || task._id}`}
                        className="text-[9px] bg-blue-500/20 text-blue-400 px-1 py-0.5 rounded truncate font-medium border border-blue-500/30"
                      >
                        {task.title}
                      </div>
                    ))}

                    {/* Personal events */}
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id || event._id}
                        className="text-[9px] px-1 py-0.5 rounded truncate font-medium text-white shadow-xs"
                        style={{
                          backgroundColor:
                            event.color || '#8B5CF6',
                        }}
                      >
                        {event.title}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected date details */}
        <div className="glass-card rounded-2xl p-6 border border-border bg-card flex flex-col justify-between min-h-[450px]">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-purple/10 text-purple border border-purple/30 flex items-center justify-center">
                  <CalendarIcon className="w-4 h-4" />
                </div>

                <h3 className="text-sm font-bold text-text-primary">
                  {monthName} {selectedDay}, {year}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-purple text-white text-[11px] font-semibold shadow-purple-glow hover:bg-purple-hover transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <h4 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                Scheduled Items
              </h4>

              {loading ? (
                <div className="py-10 text-center text-text-muted text-xs">
                  Loading calendar...
                </div>
              ) : selectedDayTasks.length === 0 &&
                selectedDayEvents.length === 0 ? (
                <div className="py-10 text-center text-text-muted text-xs">
                  No tasks or reminders for this date.
                </div>
              ) : (
                <>
                  {/* Tasks */}
                  {selectedDayTasks.map((task) => (
                    <div
                      key={task.id || task._id}
                      className="p-3 rounded-xl bg-cardHover/50 border border-border/60 flex items-start justify-between gap-2"
                    >
                      <div>
                        <span className="text-[9px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                          Task
                        </span>

                        <p className="text-xs font-semibold text-text-primary mt-1">
                          {task.title}
                        </p>
                      </div>

                      <span className="text-[10px] text-text-muted">
                        {task.status}
                      </span>
                    </div>
                  ))}

                  {/* Personal events */}
                  {selectedDayEvents.map((event) => {
                    const eventId = event.id || event._id;
                    return (
                      <div
                        key={eventId}
                        className="p-3 rounded-xl bg-cardHover/50 border border-border/60 flex items-start justify-between gap-2 group"
                      >
                        <div>
                          <span
                            className="text-[9px] font-semibold px-2 py-0.5 rounded border text-white"
                            style={{
                              backgroundColor:
                                event.color || '#8B5CF6',
                            }}
                          >
                            {String(
                              event.type || 'reminder'
                            ).toUpperCase()}
                          </span>

                          <p className="text-xs font-semibold text-text-primary mt-1">
                            {event.title}
                          </p>
                        </div>

                        <button
                          onClick={() => handleDeleteEvent(eventId)}
                          className="text-text-muted hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                          aria-label="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          <p className="text-[11px] text-text-muted text-center pt-4 border-t border-border/50">
            Reminders and marks added here are strictly personal
            and private to your account.
          </p>
        </div>
      </div>

      {/* Add Reminder Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="glass-card rounded-2xl border border-border bg-[#111420] w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <h3 className="text-sm font-bold text-text-primary">
                Add Reminder / Mark
              </h3>

              <button
                onClick={() => setIsModalOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={handleCreateEvent}
              className="space-y-4"
            >
              {/* Title */}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Title / Description *
                </label>

                <input
                  type="text"
                  required
                  placeholder="e.g. Doctor appointment"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-text-primary outline-none focus:border-purple"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Type
                </label>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-2 text-xs text-text-primary outline-none focus:border-purple cursor-pointer"
                >
                  <option value="reminder">
                    Reminder
                  </option>
                  <option value="mark">
                    Mark / Highlight
                  </option>
                </select>
              </div>

              {/* Color */}
              <div>
                <label className="block text-[11px] font-semibold text-text-secondary uppercase mb-1">
                  Badge Color
                </label>

                <div className="flex items-center gap-2">
                  {[
                    '#8B5CF6',
                    '#3B82F6',
                    '#22C55E',
                    '#F59E0B',
                    '#EF4444',
                  ].map((selectedColor) => (
                    <button
                      key={selectedColor}
                      type="button"
                      onClick={() =>
                        setColor(selectedColor)
                      }
                      className={`w-6 h-6 rounded-lg border-2 ${
                        color === selectedColor
                          ? 'border-white scale-110'
                          : 'border-transparent'
                      }`}
                      style={{
                        backgroundColor: selectedColor,
                      }}
                      aria-label={`Select color ${selectedColor}`}
                    />
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-border/50">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-medium text-text-secondary hover:bg-cardHover cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-xl bg-purple text-white text-xs font-semibold shadow-purple-glow hover:bg-purple-hover cursor-pointer"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}