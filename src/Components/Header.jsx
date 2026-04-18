import { useEffect, useState } from "react";
import "../styles/header.css";
import translations from "../translations";

export default function Header({
  members,
  addTask,
  inviteMember,
  activePage,
  setActivePage,
  showTaskModal,
  setShowTaskModal,
  taskModalStatus,
  taskModalDate,
  setTaskModalDate,
  lang,
  setLang,
}) {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const t = translations[lang];

  const [taskForm, setTaskForm] = useState({
    title: "",
    description: "",
    assigneeId: "",
    dueDate: "",
    priority: "High",
    status: "To Do",
  });

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
  });

  const [inviteMessage, setInviteMessage] = useState("");

  const openedFromCalendar = Boolean(taskModalDate);

  useEffect(() => {
    if (members.length > 0) {
      setTaskForm((prev) => ({
        ...prev,
        assigneeId: prev.assigneeId || members[0].id,
      }));
    }
  }, [members]);

  useEffect(() => {
    if (showTaskModal) {
      setTaskForm({
        title: "",
        description: "",
        assigneeId: members[0]?.id || "",
        dueDate: taskModalDate || "",
        priority: "High",
        status: taskModalStatus || "To Do",
      });
    }
  }, [showTaskModal, taskModalStatus, taskModalDate, members]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowTaskModal(false);
        setShowInviteModal(false);
        setInviteMessage("");
        if (setTaskModalDate) {
          setTaskModalDate("");
        }
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [setShowTaskModal, setTaskModalDate]);

  useEffect(() => {
    if (menuOpen || showTaskModal || showInviteModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, showTaskModal, showInviteModal]);

  function openTaskModal() {
    if (setTaskModalDate) {
      setTaskModalDate("");
    }
    setShowTaskModal(true);
    setShowInviteModal(false);
    setMenuOpen(false);
  }

  function openInviteModal() {
    setShowInviteModal(true);
    setShowTaskModal(false);
    setMenuOpen(false);
    setInviteMessage("");
  }

  function handleTaskChange(e) {
    const { name, value } = e.target;

    setTaskForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleInviteChange(e) {
    const { name, value } = e.target;

    setInviteForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleAddTask(e) {
    e.preventDefault();

    if (
      !taskForm.title.trim() ||
      !taskForm.assigneeId ||
      !taskForm.dueDate ||
      !taskForm.priority
    ) {
      alert(t.pleaseFillAllFields);
      return;
    }

    addTask(taskForm);
    setShowTaskModal(false);

    if (setTaskModalDate) {
      setTaskModalDate("");
    }
  }

  function handleInvite(e) {
    e.preventDefault();

    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      alert(t.pleaseFillAllFields);
      return;
    }

    const result = inviteMember(inviteForm);
    setInviteMessage(result.message);

    if (result.success) {
      setInviteForm({
        name: "",
        email: "",
      });

      setTimeout(() => {
        setShowInviteModal(false);
        setInviteMessage("");
      }, 1000);
    }
  }

  const profileImage =
    members[0]?.avatar || "https://i.pravatar.cc/100?img=15";

  return (
    <>
      <header className="header">
        <div className="header-left">
          <div className="logo-wrap">
            <div className="logo-circle">✓</div>
            <h1 className="logo-text">{t.appTitle}</h1>
          </div>

          <nav className={`nav ${menuOpen ? "open" : ""}`}>
            <button
              type="button"
              className={
                activePage === "dashboard"
                  ? "nav-link active nav-btn"
                  : "nav-link nav-btn"
              }
              onClick={() => {
                setActivePage("dashboard");
                setMenuOpen(false);
              }}
            >
              {t.dashboard}
            </button>

            <button
              type="button"
              className={
                activePage === "list"
                  ? "nav-link active nav-btn"
                  : "nav-link nav-btn"
              }
              onClick={() => {
                setActivePage("list");
                setMenuOpen(false);
              }}
            >
              {t.list}
            </button>

            <button
              type="button"
              className={
                activePage === "board"
                  ? "nav-link active nav-btn"
                  : "nav-link nav-btn"
              }
              onClick={() => {
                setActivePage("board");
                setMenuOpen(false);
              }}
            >
              {t.board}
            </button>

            <button
              type="button"
              className={
                activePage === "calendar"
                  ? "nav-link active nav-btn"
                  : "nav-link nav-btn"
              }
              onClick={() => {
                setActivePage("calendar");
                setMenuOpen(false);
              }}
            >
              {t.calendar}
            </button>

            <div className="mobile-actions">
              <select
                className="lang-select mobile-btn"
                value={lang}
                onChange={(e) => setLang(e.target.value)}
              >
                <option value="en">English</option>
                <option value="am">Հայերեն</option>
              </select>

              <button
                type="button"
                className="invite-btn mobile-btn"
                onClick={openInviteModal}
              >
                {t.invite}
              </button>

              <button
                type="button"
                className="add-task-btn mobile-btn"
                onClick={openTaskModal}
              >
                {t.addTask}
              </button>
            </div>
          </nav>
        </div>

        <div className="header-right">
          <select
            className="lang-select desktop-only"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
          >
            <option value="en">English</option>
            <option value="am">Հայերեն</option>
          </select>

          <button
            type="button"
            className="invite-btn desktop-only"
            onClick={openInviteModal}
          >
            {t.invite}
          </button>

          <button
            type="button"
            className="add-task-btn desktop-only"
            onClick={openTaskModal}
          >
            {t.addTask}
          </button>

          <div className="profile-box desktop-only">
            <img src={profileImage} alt={t.profileAlt} className="profile-img" />
          </div>

          <button
            type="button"
            className={`burger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </header>

      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)}></div>
      )}

      {showTaskModal && (
        <div
          className="modal-overlay"
          onClick={() => {
            setShowTaskModal(false);
            if (setTaskModalDate) {
              setTaskModalDate("");
            }
          }}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{t.addNewTask}</h2>

            <form onSubmit={handleAddTask} className="modal-form">
              <input
                type="text"
                name="title"
                placeholder={t.taskTitle}
                value={taskForm.title}
                onChange={handleTaskChange}
              />

              <textarea
                name="description"
                placeholder={t.taskDescription}
                value={taskForm.description}
                onChange={handleTaskChange}
              ></textarea>

              <select
                name="assigneeId"
                value={taskForm.assigneeId}
                onChange={handleTaskChange}
              >
                {members.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>

              {openedFromCalendar ? (
                <div className="locked-date-box">
                  {t.selectedDate} {taskForm.dueDate}
                </div>
              ) : (
                <input
                  type="date"
                  name="dueDate"
                  value={taskForm.dueDate}
                  onChange={handleTaskChange}
                />
              )}

              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleTaskChange}
              >
                <option value="High">{t.high}</option>
                <option value="Medium">{t.medium}</option>
                <option value="Low">{t.low}</option>
              </select>

              <select
                name="status"
                value={taskForm.status}
                onChange={handleTaskChange}
              >
                <option value="To Do">{t.todo}</option>
                <option value="In Progress">{t.inProgress}</option>
                <option value="Done">{t.done}</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowTaskModal(false);
                    if (setTaskModalDate) {
                      setTaskModalDate("");
                    }
                  }}
                >
                  {t.cancel}
                </button>

                <button type="submit" className="save-btn">
                  {t.saveTask}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showInviteModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowInviteModal(false)}
        >
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">{t.inviteMember}</h2>

            <form onSubmit={handleInvite} className="modal-form">
              <input
                type="text"
                name="name"
                placeholder={t.fullName}
                value={inviteForm.name}
                onChange={handleInviteChange}
              />

              <input
                type="email"
                name="email"
                placeholder={t.emailAddress}
                value={inviteForm.email}
                onChange={handleInviteChange}
              />

              {inviteMessage && (
                <p className="invite-message">{inviteMessage}</p>
              )}

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowInviteModal(false);
                    setInviteMessage("");
                  }}
                >
                  {t.cancel}
                </button>

                <button type="submit" className="save-btn">
                  {t.invite}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}