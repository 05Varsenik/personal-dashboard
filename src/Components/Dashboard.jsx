import { useMemo, useState } from "react";
import "../styles/dashboard.css";

export default function Dashboard({ tasks, members, setActivePage }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  function getMember(memberId) {
    return members.find((member) => member.id === memberId);
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  const highPriorityTasks = useMemo(() => {
    return tasks
      .filter((task) => task.priority === "High")
      .slice(0, 3);
  }, [tasks]);

  const recentlyAddedTasks = useMemo(() => {
    return [...tasks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 4);
  }, [tasks]);

  const stats = useMemo(() => {
    const inProgress = tasks.filter((task) => task.status === "In Progress").length;
    const done = tasks.filter((task) => task.status === "Done").length;
    const high = tasks.filter((task) => task.priority === "High").length;
    const total = tasks.length;

    return { inProgress, done, high, total };
  }, [tasks]);

  const progressPercent = stats.total ? Math.round((stats.done / stats.total) * 100) : 0;

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

  function renderCalendarDays() {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1).getDay();
    const totalDays = new Date(year, month + 1, 0).getDate();

    const days = [];
    const startDay = firstDay === 0 ? 6 : firstDay - 1;

    for (let i = 0; i < startDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === new Date().getDate() &&
        month === new Date().getMonth() &&
        year === new Date().getFullYear();

      days.push(
        <div key={day} className={isToday ? "calendar-day active" : "calendar-day"}>
          {day}
        </div>
      );
    }

    return days;
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-title-row">
        <h2 className="dashboard-main-title">Dashboard</h2>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card high-priority-card">
          <div className="card-head">
            <h3>High Priority Tasks</h3>
            <button onClick={() => setActivePage("list")}>See All</button>
          </div>

          <div className="priority-summary">
            <span className="priority-flag">🚩</span>
            <div>
              <strong>{stats.high}</strong>
              <p>Tasks</p>
            </div>
          </div>

          <div className="priority-list">
            {highPriorityTasks.map((task) => {
              const member = getMember(task.assigneeId);
              return (
                <div key={task.id} className="priority-item">
                  <div className="priority-user">
                    <img src={member?.avatar} alt={member?.name} />
                    <span>{member?.name}</span>
                  </div>
                  <span>{formatDate(task.dueDate)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="dashboard-card overview-card">
          <div className="card-head">
            <h3>Tasks Overview</h3>
            <span className="light-chip">Last 7 Days</span>
          </div>

          <div className="overview-content">
            <div className="overview-stats">
              <div className="overview-item">
                <span className="overview-count">{stats.inProgress}</span>
                <span>In Progress</span>
              </div>

              <div className="overview-item">
                <span className="overview-count">{stats.done}</span>
                <span>Done</span>
              </div>

              <div className="overview-item">
                <span className="overview-count">{stats.high}</span>
                <span>High Priority</span>
              </div>
            </div>

            <div className="progress-circle-wrap">
              <div
                className="progress-circle"
                style={{
                  background: `conic-gradient(#7c58ff ${progressPercent}%, #ebe8f8 ${progressPercent}% 100%)`,
                }}
              >
                <div className="progress-circle-inner">
                  <strong>{stats.total}</strong>
                </div>
              </div>
              <p>Total Tasks</p>
            </div>
          </div>
        </div>

        <div className="dashboard-card stats-card">
          <div className="card-head">
            <h3>Task Stats</h3>
            <span className="light-chip">Last 7 Days</span>
          </div>

          <div className="fake-chart">
            <div className="chart-bars">
              <div style={{ height: "30%" }}></div>
              <div style={{ height: "40%" }}></div>
              <div style={{ height: "55%" }}></div>
              <div style={{ height: "52%" }}></div>
              <div style={{ height: "70%" }}></div>
              <div style={{ height: "78%" }}></div>
              <div style={{ height: "88%" }}></div>
            </div>

            <div className="chart-legend">
              <span><i className="legend purple"></i> In Progress</span>
              <span><i className="legend green"></i> Done</span>
            </div>
          </div>
        </div>

        <div className="dashboard-card calendar-card">
          <div className="card-head">
            <h3>Calendar</h3>
          </div>

          <div className="calendar-top">
            <button onClick={prevMonth}>‹</button>
            <h4>
              {currentDate.toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h4>
            <button onClick={nextMonth}>›</button>
          </div>

          <div className="week-days">
            <span>M</span>
            <span>T</span>
            <span>W</span>
            <span>T</span>
            <span>F</span>
            <span>S</span>
            <span>S</span>
          </div>

          <div className="calendar-grid">{renderCalendarDays()}</div>
        </div>
      </div>

      <div className="dashboard-card recent-card">
        <div className="card-head">
          <h3>Recently Added Tasks</h3>
          <button onClick={() => setActivePage("list")}>View All</button>
        </div>

        <div className="recent-list">
          {recentlyAddedTasks.map((task) => {
            const member = getMember(task.assigneeId);

            return (
              <div key={task.id} className="recent-item">
                <div className="recent-left">
                  <img src={member?.avatar} alt={member?.name} />
                  <span>{task.title}</span>
                </div>

                <div className="recent-right">
                  <span>{member?.name}</span>
                  <span>{formatDate(task.dueDate)}</span>
                  <span className={`priority-pill ${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}