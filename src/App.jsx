import { useState } from "react";
import "./App.css";
import Header from "./Components/Header";
import List from "./Components/List";
import Dashboard from "./Components/Dashboard";
import useTasks from "./hooks/useTasks";

export default function App() {
  const [activePage, setActivePage] = useState("dashboard");

  const {
    tasks,
    members,
    filter,
    setFilter,
    filteredTasks,
    addTask,
    deleteTask,
    toggleTaskDone,
    inviteMember,
  } = useTasks();

  return (
    <div className="app">
      <Header
        members={members}
        addTask={addTask}
        inviteMember={inviteMember}
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <main className="main-content">
        {activePage === "dashboard" && (
          <Dashboard tasks={tasks} members={members} setActivePage={setActivePage} />
        )}

        {activePage === "list" && (
          <List
            tasks={tasks}
            members={members}
            filter={filter}
            setFilter={setFilter}
            filteredTasks={filteredTasks}
            deleteTask={deleteTask}
            toggleTaskDone={toggleTaskDone}
          />
        )}
      </main>
    </div>
  );
}