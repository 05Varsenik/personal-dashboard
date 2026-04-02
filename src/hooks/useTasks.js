import { useEffect, useMemo, useState } from "react";
import { initialMembers, initialTasks } from "../data/initialData";
import { getData, setData, TASKS_KEY, MEMBERS_KEY } from "../utils/localStorage";

export default function useTasks() {
  const [tasks, setTasks] = useState(() => {
    const savedTasks = getData(TASKS_KEY);

    if (savedTasks !== null) {
      return savedTasks;
    }

    return initialTasks;
  });

  const [members, setMembers] = useState(() => {
    const savedMembers = getData(MEMBERS_KEY);

    if (savedMembers !== null) {
      return savedMembers;
    }

    return initialMembers;
  });

  const [filter, setFilter] = useState("All");

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
      assigneeId: Number(taskData.assigneeId),
      dueDate: taskData.dueDate,
      priority: taskData.priority,
      status: "In Progress",
    };

    setTasks((prev) => [newTask, ...prev]);
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

  function inviteMember(memberData) {
    const exists = members.some(
      (member) => member.email.toLowerCase() === memberData.email.toLowerCase()
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
    if (filter === "All") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  return {
    tasks,
    members,
    filter,
    setFilter,
    filteredTasks,
    addTask,
    deleteTask,
    toggleTaskDone,
    inviteMember,
  };
}