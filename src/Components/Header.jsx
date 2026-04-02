import { useEffect, useState } from "react";
import "../styles/header.css";

export default function Header({
  members,
  addTask,
  inviteMember,
  activePage,
  setActivePage,
}) {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const [taskForm, setTaskForm] = useState({
    title: "",
    assigneeId: "",
    dueDate: "",
    priority: "High",
  });

  const [inviteForm, setInviteForm] = useState({
    name: "",
    email: "",
  });

  const [inviteMessage, setInviteMessage] = useState("");

  useEffect(() => {
    if (members.length > 0) {
      setTaskForm((prev) => ({
        ...prev,
        assigneeId: prev.assigneeId || members[0].id,
      }));
    }
  }, [members]);

  useEffect(() => {
    function handleEscape(e) {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowTaskModal(false);
        setShowInviteModal(false);
        setInviteMessage("");
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
    setTaskForm({
      title: "",
      assigneeId: members[0]?.id || "",
      dueDate: "",
      priority: "High",
    });
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
      alert("Please fill all fields.");
      return;
    }

    addTask(taskForm);
    setShowTaskModal(false);
  }

  function handleInvite(e) {
    e.preventDefault();

    if (!inviteForm.name.trim() || !inviteForm.email.trim()) {
      alert("Please fill all fields.");
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
            <h1 className="logo-text">Task Manager</h1>
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
              Dashboard
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
              List
            </button>

            <button type="button" className="nav-link nav-btn">
              Board
            </button>

            <button type="button" className="nav-link nav-btn">
              Calendar
            </button>

            <div className="mobile-actions">
              <button
                type="button"
                className="invite-btn mobile-btn"
                onClick={openInviteModal}
              >
                Invite
              </button>

              <button
                type="button"
                className="add-task-btn mobile-btn"
                onClick={openTaskModal}
              >
                + Add Task
              </button>
            </div>
          </nav>
        </div>

        <div className="header-right">
          <button
            type="button"
            className="invite-btn desktop-only"
            onClick={openInviteModal}
          >
            Invite
          </button>

          <button
            type="button"
            className="add-task-btn desktop-only"
            onClick={openTaskModal}
          >
            + Add Task
          </button>

          <button type="button" className="icon-btn desktop-only">
            🔔
          </button>

          <div className="profile-box desktop-only">
            <img src={profileImage} alt="profile" className="profile-img" />
            <span className="profile-arrow">⌄</span>
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
        <div
          className="menu-overlay"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}

      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 className="modal-title">Add New Task</h2>

            <form onSubmit={handleAddTask} className="modal-form">
              <input
                type="text"
                name="title"
                placeholder="Task title"
                value={taskForm.title}
                onChange={handleTaskChange}
              />

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

              <input
                type="date"
                name="dueDate"
                value={taskForm.dueDate}
                onChange={handleTaskChange}
              />

              <select
                name="priority"
                value={taskForm.priority}
                onChange={handleTaskChange}
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowTaskModal(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Save Task
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
            <h2 className="modal-title">Invite Member</h2>

            <form onSubmit={handleInvite} className="modal-form">
              <input
                type="text"
                name="name"
                placeholder="Full name"
                value={inviteForm.name}
                onChange={handleInviteChange}
              />

              <input
                type="email"
                name="email"
                placeholder="Email address"
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
                  Cancel
                </button>

                <button type="submit" className="save-btn">
                  Invite
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}