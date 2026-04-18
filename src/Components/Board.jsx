import { useState } from "react";
import "../styles/board.css";
import translations from "../translations";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { restrictToWindowEdges } from "@dnd-kit/modifiers";

export default function Board({
  tasks = [],
  members = [],
  updateTask,
  deleteTask,
  setShowTaskModal,
  setTaskModalStatus,
  moveTask,
  lang,
}) {
  const t = translations[lang];

  const [activeTaskId, setActiveTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [boardPriorityFilter, setBoardPriorityFilter] = useState("All");

  const [editForm, setEditForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
    dueDate: "",
    priority: "High",
    status: "To Do",
  });

  const sensors = useSensors(useSensor(PointerSensor));

  const visibleTasks =
    boardPriorityFilter === "All"
      ? tasks
      : tasks.filter((task) => task.priority === boardPriorityFilter);

  const todoTasks = visibleTasks.filter((task) => task.status === "To Do");
  const inProgressTasks = visibleTasks.filter(
    (task) => task.status === "In Progress"
  );
  const doneTasks = visibleTasks.filter((task) => task.status === "Done");

  const activeTask = tasks.find((task) => task.id === Number(activeTaskId));
  const activeMember = members.find(
    (member) => member.id === activeTask?.assigneeId
  );

  function handleOpenTaskModal(status) {
    setTaskModalStatus(status);
    setShowTaskModal(true);
  }

  function handleDragStart(event) {
    setActiveTaskId(event.active.id);
  }

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) {
      setActiveTaskId(null);
      return;
    }

    const taskId = Number(active.id);
    const newStatus = over.id;

    moveTask(taskId, newStatus);
    setActiveTaskId(null);
  }

  function handleDragCancel() {
    setActiveTaskId(null);
  }

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

  return (
    <>
      <section className="board-page">
        <div className="board-top">
          <div>
            <h1 className="board-main-title">{t.board}</h1>
            <p className="board-subtitle">
              {lang === "am"
                ? "Կառավարիր առաջադրանքները տեսողական ձևով"
                : "Visualize and manage your tasks"}
            </p>
          </div>

          <div className="board-actions">
            <select
              className="filter-btn"
              value={boardPriorityFilter}
              onChange={(e) => setBoardPriorityFilter(e.target.value)}
            >
              <option value="All">{lang === "am" ? "Բոլորը" : "All"}</option>
              <option value="High">{t.high}</option>
              <option value="Medium">{t.medium}</option>
              <option value="Low">{t.low}</option>
            </select>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
          onDragCancel={handleDragCancel}
        >
          <div className="board-columns">
            <Column
              id="To Do"
              title={t.todo}
              tasks={todoTasks}
              members={members}
              deleteTask={deleteTask}
              moveTask={moveTask}
              openEditModal={openEditModal}
              bgClass="todo-column"
              dotClass="todo-dot"
              onAddTask={handleOpenTaskModal}
              lang={lang}
            />

            <Column
              id="In Progress"
              title={t.inProgress}
              tasks={inProgressTasks}
              members={members}
              deleteTask={deleteTask}
              moveTask={moveTask}
              openEditModal={openEditModal}
              bgClass="progress-column"
              dotClass="progress-dot"
              onAddTask={handleOpenTaskModal}
              lang={lang}
            />

            <Column
              id="Done"
              title={t.done}
              tasks={doneTasks}
              members={members}
              deleteTask={deleteTask}
              moveTask={moveTask}
              openEditModal={openEditModal}
              bgClass="done-column"
              dotClass="done-dot"
              onAddTask={handleOpenTaskModal}
              lang={lang}
            />
          </div>

          <DragOverlay modifiers={[restrictToWindowEdges]} zIndex={3000}>
            {activeTask ? (
              <TaskCardView
                task={activeTask}
                member={activeMember}
                isOverlay={true}
                lang={lang}
              />
            ) : null}
          </DragOverlay>
        </DndContext>

        <div className="board-bottom">
          <p className="total-tasks">
            {lang === "am"
              ? `Բոլոր առաջադրանքները՝ ${visibleTasks.length}`
              : `Total Tasks: ${visibleTasks.length}`}
          </p>

          <div className="priority-legend">
            <span>
              <i className="legend-dot low-legend"></i>
              {t.low}
            </span>

            <span>
              <i className="legend-dot medium-legend"></i>
              {t.medium}
            </span>

            <span>
              <i className="legend-dot high-legend"></i>
              {t.high}
            </span>
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

function Column({
  id,
  title,
  tasks,
  members,
  deleteTask,
  moveTask,
  openEditModal,
  bgClass,
  dotClass,
  onAddTask,
  lang,
}) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`board-column ${bgClass} ${isOver ? "column-over" : ""}`}
    >
      <div className="board-column-head">
        <div className="board-column-left">
          <span className={`column-dot ${dotClass}`}></span>
          <h2>{title}</h2>
          <span className="task-count">{tasks.length}</span>
        </div>

        <button
          type="button"
          className="column-add-btn"
          onClick={() => onAddTask(id)}
        >
          +
        </button>
      </div>

      <div className="board-tasks">
        {tasks.map((task) => {
          const member = members.find((item) => item.id === task.assigneeId);

          return (
            <TaskCard
              key={task.id}
              task={task}
              member={member}
              deleteTask={deleteTask}
              moveTask={moveTask}
              openEditModal={openEditModal}
              lang={lang}
            />
          );
        })}
      </div>

      <button
        type="button"
        className="add-task-box"
        onClick={() => onAddTask(id)}
      >
        {lang === "am" ? "+ Ավելացնել առաջադրանք" : "+ Add Task"}
      </button>
    </div>
  );
}

function TaskCard({ task, member, deleteTask, moveTask, openEditModal, lang }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useDraggable({
      id: String(task.id),
    });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  return (
    <div ref={setNodeRef} style={style}>
      <TaskCardView
        task={task}
        member={member}
        deleteTask={deleteTask}
        moveTask={moveTask}
        openEditModal={openEditModal}
        dragListeners={listeners}
        dragAttributes={attributes}
        lang={lang}
      />
    </div>
  );
}

function TaskCardView({
  task,
  member,
  deleteTask,
  moveTask,
  openEditModal,
  dragListeners,
  dragAttributes,
  isOverlay = false,
  lang,
}) {
  const t = translations[lang];

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

  function getPriorityClass(priority) {
    if (priority === "Low") return "low-priority";
    if (priority === "Medium") return "medium-priority";
    return "high-priority";
  }

  function getPriorityText(priority) {
    if (priority === "Low") return t.low;
    if (priority === "Medium") return t.medium;
    return t.high;
  }

  return (
    <div className={`task-card ${isOverlay ? "task-card-overlay" : ""}`}>
      <div
        className={!isOverlay ? "task-drag-area" : ""}
        {...(!isOverlay ? dragListeners : {})}
        {...(!isOverlay ? dragAttributes : {})}
      >
        {!isOverlay && <div className="task-drag-handle">⋮⋮</div>}

        <h3 className="task-title">{task.title}</h3>

        {task.description && (
          <p className="task-description">{task.description}</p>
        )}

        <div className="task-user">
          <img
            src={member?.avatar || "https://via.placeholder.com/40"}
            alt={member?.name || "User"}
            className="task-avatar"
          />
          <span>{member?.name || (lang === "am" ? "Անհայտ օգտատեր" : "Unknown user")}</span>
        </div>

        <div className={`task-priority ${getPriorityClass(task.priority)}`}>
          <span className="priority-dot"></span>
          {getPriorityText(task.priority)}
        </div>

        <div className="task-footer">
          <div className="task-date">
            <span className="calendar-icon">🗓</span>
            <span>{formatDate(task.dueDate)}</span>
          </div>
        </div>
      </div>

      {!isOverlay && (
        <div className="task-card-actions">
          <div className="task-status-buttons">
            {task.status !== "To Do" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  moveTask(task.id, "To Do");
                }}
              >
                {t.todo}
              </button>
            )}

            {task.status !== "In Progress" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  moveTask(task.id, "In Progress");
                }}
              >
                {lang === "am" ? "Ընթացքում" : "Progress"}
              </button>
            )}

            {task.status !== "Done" && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  moveTask(task.id, "Done");
                }}
              >
                {t.done}
              </button>
            )}
          </div>

          <div className="task-main-actions">
            <button
              type="button"
              className="task-edit-btn"
              onClick={(e) => {
                e.stopPropagation();
                openEditModal(task);
              }}
            >
              {lang === "am" ? "Խմբագրել" : "Edit"}
            </button>

            <button
              type="button"
              className="task-menu"
              onClick={(e) => {
                e.stopPropagation();
                deleteTask(task.id);
              }}
            >
              {lang === "am" ? "Ջնջել" : "Delete"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}