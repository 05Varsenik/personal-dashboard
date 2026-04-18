import { useMemo, useState } from "react";
import "../styles/calendar.css";
import translations from "../translations";

export default function Calendar({
  tasks = [],
  members = [],
  setShowTaskModal,
  setTaskModalDate,
  lang,
}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const t = translations[lang];

  function getMember(memberId) {
    return members.find((member) => member.id === Number(memberId));
  }

  function prevMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  }

  function nextMonth() {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  }

  function formatTime(dateString) {
    if (!dateString) return "";

    if (lang === "am") {
      const date = new Date(dateString);
      return date.toLocaleDateString("hy-AM", {
        month: "short",
        day: "numeric",
      });
    }

    return dateString;
  }

  function handleDayClick(dayObj) {
    if (!dayObj.currentMonth || !dayObj.dateKey) return;

    if (setTaskModalDate) {
      setTaskModalDate(dayObj.dateKey);
    }

    if (setShowTaskModal) {
      setShowTaskModal(true);
    }
  }

  const monthLabel =
    lang === "am"
      ? currentDate.toLocaleDateString("hy-AM", {
          month: "long",
          year: "numeric",
        })
      : currentDate.toLocaleDateString("en-US", {
          month: "long",
          year: "numeric",
        });

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const prevMonthDays = new Date(year, month, 0).getDate();

    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    const days = [];

    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthDays - i,
        currentMonth: false,
        dateKey: null,
      });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const fullDate = new Date(year, month, day);
      const dateKey = fullDate.toISOString().split("T")[0];

      days.push({
        day,
        currentMonth: true,
        dateKey,
      });
    }

    while (days.length < 42) {
      days.push({
        day: days.length - (startDay + daysInMonth) + 1,
        currentMonth: false,
        dateKey: null,
      });
    }

    return days;
  }, [currentDate]);

  const tasksByDate = useMemo(() => {
    const grouped = {};

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      if (!grouped[task.dueDate]) {
        grouped[task.dueDate] = [];
      }

      grouped[task.dueDate].push(task);
    });

    return grouped;
  }, [tasks]);

  const upcomingTasks = useMemo(() => {
    return [...tasks]
      .filter((task) => task.dueDate)
      .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      .slice(0, 6);
  }, [tasks]);

  function getPriorityClass(priority) {
    const value = String(priority || "").toLowerCase();

    if (value === "high") return "high";
    if (value === "medium") return "medium";
    return "low";
  }

  function getPriorityText(priority) {
    if (priority === "High") return t.high;
    if (priority === "Medium") return t.medium;
    return t.low;
  }

  function isToday(dayObj) {
    if (!dayObj.dateKey) return false;
    const today = new Date().toISOString().split("T")[0];
    return dayObj.dateKey === today;
  }

  return (
    <section className="calendar-page">
      <div className="calendar-header">
        <div>
          <h2 className="calendar-main-title">{t.calendar}</h2>
          <p className="calendar-subtitle">
            {lang === "am"
              ? "Տեսիր և կառավարիր առաջադրանքները ըստ վերջնաժամկետների"
              : "View and manage your tasks by due dates"}
          </p>
        </div>
      </div>

      <div className="calendar-layout">
        <div className="calendar-main-card">
          <div className="calendar-toolbar">
            <div className="calendar-toolbar-left">
              <button type="button" className="today-btn">
                {lang === "am" ? "Այսօր" : "Today"}
              </button>

              <div className="month-nav">
                <button type="button" onClick={prevMonth}>
                  ‹
                </button>
                <button type="button" onClick={nextMonth}>
                  ›
                </button>
              </div>

              <h3 className="month-title">{monthLabel}</h3>
            </div>

            <div className="calendar-toolbar-right">
              <button
                type="button"
                className="add-task-calendar-btn"
                onClick={() => setShowTaskModal && setShowTaskModal(true)}
              >
                {lang === "am" ? "+ Ավելացնել առաջադրանք" : "+ Add Task"}
              </button>
            </div>
          </div>

          <div className="week-row">
            {lang === "am" ? (
              <>
                <span>Երկ</span>
                <span>Երք</span>
                <span>Չրք</span>
                <span>Հնգ</span>
                <span>Ուրբ</span>
                <span>Շբթ</span>
                <span>Կիր</span>
              </>
            ) : (
              <>
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </>
            )}
          </div>

          <div className="month-grid">
            {calendarDays.map((dayObj, index) => {
              const dayTasks = dayObj.dateKey ? tasksByDate[dayObj.dateKey] || [] : [];

              return (
                <div
                  key={index}
                  className={`month-cell ${dayObj.currentMonth ? "" : "muted"} ${
                    isToday(dayObj) ? "today-cell" : ""
                  } ${dayObj.currentMonth ? "clickable-day" : ""}`}
                  onClick={() => handleDayClick(dayObj)}
                >
                  <div className="month-cell-top">
                    <span className="day-number">{dayObj.day}</span>
                  </div>

                  <div className="cell-tasks">
                    {dayTasks.slice(0, 2).map((task) => (
                      <div
                        key={task.id}
                        className={`calendar-task-chip ${getPriorityClass(task.priority)}`}
                      >
                        <span className="chip-dot"></span>
                        <div>
                          <strong>{task.title}</strong>
                          <small>{formatTime(task.dueDate)}</small>
                        </div>
                      </div>
                    ))}

                    {dayTasks.length > 2 && (
                      <span className="more-tasks">
                        {lang === "am"
                          ? `+ ևս ${dayTasks.length - 2}`
                          : `+${dayTasks.length - 2} more`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <aside className="calendar-sidebar">
          <div className="mini-calendar-card">
            <div className="mini-calendar-head">
              <h4>{monthLabel}</h4>
            </div>

            <div className="mini-week-row">
              {lang === "am" ? (
                <>
                  <span>Ե</span>
                  <span>Ե</span>
                  <span>Չ</span>
                  <span>Հ</span>
                  <span>Ու</span>
                  <span>Շ</span>
                  <span>Կ</span>
                </>
              ) : (
                <>
                  <span>M</span>
                  <span>T</span>
                  <span>W</span>
                  <span>T</span>
                  <span>F</span>
                  <span>S</span>
                  <span>S</span>
                </>
              )}
            </div>

            <div className="mini-grid">
              {calendarDays.slice(0, 35).map((dayObj, index) => (
                <div
                  key={index}
                  className={`mini-day ${dayObj.currentMonth ? "" : "muted"} ${
                    isToday(dayObj) ? "active" : ""
                  }`}
                >
                  {dayObj.day}
                </div>
              ))}
            </div>
          </div>

          <div className="upcoming-card">
            <div className="upcoming-head">
              <h4>{lang === "am" ? "Մոտակա առաջադրանքներ" : "Upcoming Tasks"}</h4>
            </div>

            <div className="upcoming-list">
              {upcomingTasks.length > 0 ? (
                upcomingTasks.map((task) => {
                  const member = getMember(task.assigneeId);

                  return (
                    <div key={task.id} className="upcoming-item">
                      <div className="upcoming-left">
                        <span className={`upcoming-dot ${getPriorityClass(task.priority)}`}></span>

                        <div>
                          <strong>{task.title}</strong>
                          <p>
                            {lang === "am"
                              ? formatTime(task.dueDate)
                              : task.dueDate}
                            {member?.name ? ` • ${member.name}` : ""}
                          </p>
                        </div>
                      </div>

                      <span className={`upcoming-badge ${getPriorityClass(task.priority)}`}>
                        {getPriorityText(task.priority)}
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="no-upcoming">
                  {lang === "am" ? "Մոտակա առաջադրանքներ չկան" : "No upcoming tasks"}
                </p>
              )}
            </div>

            <button
              type="button"
              className="sidebar-add-btn"
              onClick={() => setShowTaskModal && setShowTaskModal(true)}
            >
              {lang === "am" ? "+ Ավելացնել նոր առաջադրանք" : "+ Add New Task"}
            </button>
          </div>
        </aside>
      </div>
    </section>
  );
}