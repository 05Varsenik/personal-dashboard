import { useEffect, useMemo, useState } from "react";
import { initialMembers, initialTasks } from "../data/initialData";
import {
  getData,
  setData,
  TASKS_KEY,
  MEMBERS_KEY,
} from "../utils/localStorage";

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = getData(TASKS_KEY);
    return savedTasks !== null ? savedTasks : initialTasks;
  });

  const [members, setMembers] = useState(() => {
    const savedMembers = getData(MEMBERS_KEY);
    return savedMembers !== null ? savedMembers : initialMembers;
  });

  const [filter, setFilter] = useState({
    search: "",
    status: "All",
    priority: "All",
    assignee: "All",
    sortBy: "newest",
  });

  useEffect(() => {
    setData(TASKS_KEY, tasks);
  }, [tasks]);

  useEffect(() => {
    setData(MEMBERS_KEY, members);
  }, [members]);

  function addTask(taskData) {
    const newTask = {
      id: Date.now(),
      title: taskData.title,
      description: taskData.description || "",
      assigneeId: Number(taskData.assigneeId),
      dueDate: taskData.dueDate,
      priority: taskData.priority || "Medium",
      status: taskData.status || "To Do",
      createdAt: new Date().toISOString(),
    };

    setTasks((prev) => [newTask, ...prev]);
  }

  function updateTask(taskId, updatedData) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...updatedData,
              assigneeId:
                updatedData.assigneeId !== undefined
                  ? Number(updatedData.assigneeId)
                  : task.assigneeId,
            }
          : task
      )
    );
  }

  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId));
  }

  function toggleTaskDone(taskId) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: task.status === "Done" ? "In Progress" : "Done",
            }
          : task
      )
    );
  }

  function updateTaskStatus(taskId, newStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  function moveTask(taskId, newStatus) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  function inviteMember(memberData) {
    const exists = members.some(
      (member) =>
        member.email.toLowerCase() === memberData.email.toLowerCase()
    );

    if (exists) {
      return {
        success: false,
        message: "This email is already invited.",
      };
    }

    const newMember = {
      id: Date.now(),
      name: memberData.name,
      email: memberData.email,
      avatar: `https://i.pravatar.cc/40?u=${memberData.email}`,
    };

    setMembers((prev) => [...prev, newMember]);

    return {
      success: true,
      message: "Member invited successfully.",
    };
  }

  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    if (filter.search.trim()) {
      result = result.filter((task) =>
        task.title.toLowerCase().includes(filter.search.toLowerCase())
      );
    }

    if (filter.status !== "All") {
      result = result.filter((task) => task.status === filter.status);
    }

    if (filter.priority !== "All") {
      result = result.filter((task) => task.priority === filter.priority);
    }

    if (filter.assignee !== "All") {
      result = result.filter(
        (task) => String(task.assigneeId) === String(filter.assignee)
      );
    }

    if (filter.sortBy === "newest") {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    if (filter.sortBy === "oldest") {
      result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    if (filter.sortBy === "due-soon") {
      result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
    }

    if (filter.sortBy === "priority") {
      const priorityOrder = {
        High: 1,
        Medium: 2,
        Low: 3,
      };

      result.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }

    return result;
  }, [tasks, filter]);

  return {
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
  };
}