export const STORAGE_KEY = "todos";

export function loadTodos() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) return [];

  try {
    const parsedTodos = JSON.parse(savedData);
    return parsedTodos.map((todo) => ({ ...todo, isEditing: false }));
  } catch {
    return [];
  }
}

export function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}
