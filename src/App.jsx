import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import List from "./Components/List";
import Dashboard from "./Components/Dashboard";
import Calendar from "./Components/Calendar";
import Board from "./Components/Board";
import useTasks from "./hooks/useTasks";

export default function App() {
  const [activePage, setActivePage] = useState(() => {
    return localStorage.getItem("activePage") || "dashboard";
  });

  const [lang, setLang] = useState(() => {
    return localStorage.getItem("lang") || "en";
  });

  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskModalStatus, setTaskModalStatus] = useState("To Do");
  const [taskModalDate, setTaskModalDate] = useState("");

  const {
    tasks,
    members,
    filter,
    setFilter,
    filteredTasks,
    addTask,
    updateTask,
    deleteTask,
    toggleTaskDone,
    updateTaskStatus,
    inviteMember,
    moveTask,
  } = useTasks();

  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  useEffect(() => {
    localStorage.setItem("lang", lang);
  }, [lang]);

  return (
    <div className="app">
      <Header
        members={members}
        addTask={addTask}
        inviteMember={inviteMember}
        activePage={activePage}
        setActivePage={setActivePage}
        showTaskModal={showTaskModal}
        setShowTaskModal={setShowTaskModal}
        taskModalStatus={taskModalStatus}
        taskModalDate={taskModalDate}
        setTaskModalDate={setTaskModalDate}
        lang={lang}
        setLang={setLang}
      />

      <main className="mainContent">
        {activePage === "dashboard" && (
          <Dashboard
            tasks={tasks}
            members={members}
            setActivePage={setActivePage}
            lang={lang}
          />
        )}

        {activePage === "list" && (
          <List
            tasks={filteredTasks}
            members={members}
            filter={filter}
            setFilter={setFilter}
            updateTask={updateTask}
            deleteTask={deleteTask}
            toggleTaskDone={toggleTaskDone}
            updateTaskStatus={updateTaskStatus}
            moveTask={moveTask}
            lang={lang}
          />
        )}

        {activePage === "board" && (
          <Board
            tasks={tasks}
            members={members}
            updateTask={updateTask}
            deleteTask={deleteTask}
            setShowTaskModal={setShowTaskModal}
            setTaskModalStatus={setTaskModalStatus}
            moveTask={moveTask}
            lang={lang}
          />
        )}

        {activePage === "calendar" && (
          <Calendar
            tasks={tasks}
            members={members}
            setShowTaskModal={setShowTaskModal}
            setTaskModalDate={setTaskModalDate}
            lang={lang}
          />
        )}
      </main>
    </div>
  );
}