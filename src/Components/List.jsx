import { useEffect, useMemo, useState } from "react";
import "../styles/list.css";

export default function List({
  tasks,
  members,
  filter,
  setFilter,
  filteredTasks,
  deleteTask,
  toggleTaskDone,
}) {
  const [currentPage, setCurrentPage] = useState(1);

  const tasksPerPage = 5;

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

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage) || 1;

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return filteredTasks.slice(startIndex, endIndex);
  }, [filteredTasks, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startItem =
    filteredTasks.length === 0 ? 0 : (currentPage - 1) * tasksPerPage + 1;

  const endItem = Math.min(currentPage * tasksPerPage, filteredTasks.length);

  function goToPrevPage() {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }

  function goToNextPage() {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  }

  function renderPageNumbers() {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={currentPage === i ? "page-number active" : "page-number"}
          onClick={() => setCurrentPage(i)}
        >
          {i}
        </button>
      );
    }

    return pages;
  }

  return (
    <section className="tasks-page">
      <div className="tasks-top">
        <div>
          <h2 className="tasks-title">Tasks</h2>
          <p className="tasks-subtitle">Manage your daily tasks</p>
        </div>

        <div className="filters">
          <button
            className={filter === "All" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("All")}
          >
            All
          </button>

          <button
            className={filter === "In Progress" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("In Progress")}
          >
            In Progress
          </button>

          <button
            className={filter === "Done" ? "filter-btn active" : "filter-btn"}
            onClick={() => setFilter("Done")}
          >
            Done
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="tasks-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Assignee</th>
              <th>Due Date</th>
              <th>Priority</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {paginatedTasks.length > 0 ? (
              paginatedTasks.map((task) => {
                const member = getMember(task.assigneeId);
                const isDone = task.status === "Done";

                return (
                  <tr key={task.id}>
                    <td>
                      <div className="task-cell">
                        <input
                          type="checkbox"
                          checked={isDone}
                          onChange={() => toggleTaskDone(task.id)}
                        />
                        <span className={isDone ? "task-title done" : "task-title"}>
                          {task.title}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="assignee-cell">
                        <img
                          src={member?.avatar}
                          alt={member?.name}
                          className="assignee-avatar"
                        />
                        <span>{member?.name}</span>
                      </div>
                    </td>

                    <td>{formatDate(task.dueDate)}</td>

                    <td>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        <span className="dot"></span>
                        {task.priority}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`status-badge ${task.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {task.status}
                      </span>
                    </td>

                    <td>
                      <button
                        className="more-btn"
                        onClick={() => deleteTask(task.id)}
                        title="Delete task"
                      >
                        delete
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="empty-row">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <p>
          Showing {startItem} - {endItem} of {filteredTasks.length} tasks
        </p>

        <div className="pagination">
          <button onClick={goToPrevPage} disabled={currentPage === 1}>
            {"<"}
          </button>

          {renderPageNumbers()}

          <button onClick={goToNextPage} disabled={currentPage === totalPages}>
            {">"}
          </button>
        </div>
      </div>
    </section>
  );
}