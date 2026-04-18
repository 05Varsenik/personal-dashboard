import { useEffect, useMemo, useState } from "react";
import "../styles/list.css";
import translations from "../translations";

export default function List({
  tasks,
  members,
  filter,
  setFilter,
  updateTask,
  deleteTask,
  toggleTaskDone,
  updateTaskStatus,
  moveTask,
  lang,
}) {
  const t = translations[lang];

  const [currentPage, setCurrentPage] = useState(1);
  const [editingTask, setEditingTask] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
    dueDate: "",
    priority: "High",
    status: "To Do",
  });

  const tasksPerPage = 5;

  function getMember(memberId) {
    return members.find((member) => member.id === Number(memberId));
  }

  function formatDate(dateString) {
    const date = new Date(dateString);

    if (lang === "am") {
      return date.toLocaleDateString("hy-AM", {
        month: "short",
        day: "numeric",
      });
    }

    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  }

  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  function openEditModal(task) {
    setEditingTask(task);
    setEditForm({
      title: task.title,
      description: task.description || "",
      assigneeId: task.assigneeId,
      dueDate: task.dueDate,
      priority: task.priority,
      status: task.status,
    });
  }

  function closeEditModal() {
    setEditingTask(null);
  }

  function handleEditChange(e) {
    const { name, value } = e.target;

    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleEditSubmit(e) {
    e.preventDefault();

    if (
      !editForm.title.trim() ||
      !editForm.assigneeId ||
      !editForm.dueDate ||
      !editForm.priority ||
      !editForm.status
    ) {
      alert(t.pleaseFillAllFields);
      return;
    }

    updateTask(editingTask.id, editForm);
    closeEditModal();
  }

  const totalPages = Math.ceil(tasks.length / tasksPerPage) || 1;

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * tasksPerPage;
    const endIndex = startIndex + tasksPerPage;
    return tasks.slice(startIndex, endIndex);
  }, [tasks, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const startItem =
    tasks.length === 0 ? 0 : (currentPage - 1) * tasksPerPage + 1;

  const endItem = Math.min(currentPage * tasksPerPage, tasks.length);

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
          type="button"
        >
          {i}
        </button>
      );
    }

    return pages;
  }

  return (
    <>
      <section className="tasks-page">
        <div className="tasks-top">
          <div>
            <h2 className="tasks-title">
              {lang === "am" ? "Առաջադրանքներ" : "Tasks"}
            </h2>
            <p className="tasks-subtitle">
              {lang === "am"
                ? "Կառավարիր քո ամենօրյա առաջադրանքները"
                : "Manage your daily tasks"}
            </p>
          </div>

          <div className="filters filters-wrap">
            <input
              type="text"
              className="filter-search"
              placeholder={lang === "am" ? "Փնտրել առաջադրանք..." : "Search task..."}
              value={filter.search}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  search: e.target.value,
                }))
              }
            />

            <select
              value={filter.status}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  status: e.target.value,
                }))
              }
            >
              <option value="All">
                {lang === "am" ? "Բոլոր կարգավիճակները" : "All Statuses"}
              </option>
              <option value="To Do">{t.todo}</option>
              <option value="In Progress">{t.inProgress}</option>
              <option value="Done">{t.done}</option>
            </select>

            <select
              value={filter.priority}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  priority: e.target.value,
                }))
              }
            >
              <option value="All">
                {lang === "am" ? "Բոլոր առաջնահերթությունները" : "All Priorities"}
              </option>
              <option value="High">{t.high}</option>
              <option value="Medium">{t.medium}</option>
              <option value="Low">{t.low}</option>
            </select>

            <select
              value={filter.assignee}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  assignee: e.target.value,
                }))
              }
            >
              <option value="All">
                {lang === "am" ? "Բոլոր պատասխանատուները" : "All Assignees"}
              </option>
              {members.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name}
                </option>
              ))}
            </select>

            <select
              value={filter.sortBy}
              onChange={(e) =>
                setFilter((prev) => ({
                  ...prev,
                  sortBy: e.target.value,
                }))
              }
            >
              <option value="newest">
                {lang === "am" ? "Նորերը սկզբում" : "Newest"}
              </option>
              <option value="oldest">
                {lang === "am" ? "Հները սկզբում" : "Oldest"}
              </option>
              <option value="due-soon">
                {lang === "am" ? "Մոտ ժամկետով" : "Due Soon"}
              </option>
              <option value="priority">
                {lang === "am" ? "Ըստ առաջնահերթության" : "Priority"}
              </option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="tasks-table">
            <thead>
              <tr>
                <th>{lang === "am" ? "Առաջադրանք" : "Task"}</th>
                <th>{lang === "am" ? "Պատասխանատու" : "Assignee"}</th>
                <th>{lang === "am" ? "Վերջնաժամկետ" : "Due Date"}</th>
                <th>{lang === "am" ? "Առաջնահերթություն" : "Priority"}</th>
                <th>{lang === "am" ? "Կարգավիճակ" : "Status"}</th>
                <th>{lang === "am" ? "Գործողություններ" : "Actions"}</th>
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

                          <div className="task-text-wrap">
                            <span
                              className={
                                isDone ? "task-title done" : "task-title"
                              }
                            >
                              {task.title}
                            </span>

                            {task.description && (
                              <p className="task-desc">{task.description}</p>
                            )}
                          </div>
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
                        <span
                          className={`priority-badge ${task.priority.toLowerCase()}`}
                        >
                          <span className="dot"></span>
                          {task.priority === "High"
                            ? t.high
                            : task.priority === "Medium"
                            ? t.medium
                            : t.low}
                        </span>
                      </td>

                      <td>
                        <select
                          className={`status-select ${task.status
                            .toLowerCase()
                            .replace(/\s+/g, "-")}`}
                          value={task.status}
                          onChange={(e) => moveTask(task.id, e.target.value)}
                        >
                          <option value="To Do">{t.todo}</option>
                          <option value="In Progress">{t.inProgress}</option>
                          <option value="Done">{t.done}</option>
                        </select>
                      </td>

                      <td>
                        <div className="action-buttons">
                          <button
                            type="button"
                            className="edit-btn"
                            onClick={() => openEditModal(task)}
                          >
                            {lang === "am" ? "Խմբագրել" : "Edit"}
                          </button>

                          <button
                            type="button"
                            className="delete-btn"
                            onClick={() => deleteTask(task.id)}
                            title={lang === "am" ? "Ջնջել առաջադրանքը" : "Delete task"}
                          >
                            {lang === "am" ? "Ջնջել" : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="empty-row">
                    {lang === "am" ? "Առաջադրանքներ չեն գտնվել" : "No tasks found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="table-footer">
          <p>
            {lang === "am"
              ? `Ցուցադրվում է ${startItem} - ${endItem} / ${tasks.length}`
              : `Showing ${startItem} - ${endItem} of ${tasks.length} tasks`}
          </p>

          <div className="pagination">
            <button
              type="button"
              onClick={goToPrevPage}
              disabled={currentPage === 1}
            >
              {"<"}
            </button>

            {renderPageNumbers()}

            <button
              type="button"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              {">"}
            </button>
          </div>
        </div>
      </section>

      {editingTask && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">
              {lang === "am" ? "Խմբագրել առաջադրանքը" : "Edit Task"}
            </h2>

            <form onSubmit={handleEditSubmit} className="modal-form">
              <input
                type="text"
                name="title"
                placeholder={t.taskTitle}
                value={editForm.title}
                onChange={handleEditChange}
              />

              <textarea
                name="description"
                placeholder={t.taskDescription}
                value={editForm.description}
                onChange={handleEditChange}
              ></textarea>

              <select
                name="assigneeId"
                value={editForm.assigneeId}
                onChange={handleEditChange}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                name="dueDate"
                value={editForm.dueDate}
                onChange={handleEditChange}
              />

              <select
                name="priority"
                value={editForm.priority}
                onChange={handleEditChange}
              >
                <option value="High">{t.high}</option>
                <option value="Medium">{t.medium}</option>
                <option value="Low">{t.low}</option>
              </select>

              <select
                name="status"
                value={editForm.status}
                onChange={handleEditChange}
              >
                <option value="To Do">{t.todo}</option>
                <option value="In Progress">{t.inProgress}</option>
                <option value="Done">{t.done}</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeEditModal}
                >
                  {t.cancel}
                </button>

                <button type="submit" className="save-btn">
                  {lang === "am" ? "Պահպանել փոփոխությունները" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}