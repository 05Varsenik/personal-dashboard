export const TASKS_KEY = "task_manager_tasks";
export const MEMBERS_KEY = "task_manager_members";

export function getData(key) {
  const data = localStorage.getItem(key);

  if (data === null) {
    return null;
  }

  return JSON.parse(data);
}

export function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}