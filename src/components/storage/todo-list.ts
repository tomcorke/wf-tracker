import { create } from "zustand";
import { persist } from "zustand/middleware";

type TodoItem = { id: string; title: string; completed: boolean };

type TodoListDataStore = {
  items: TodoItem[];
  addItem: (title: string) => void;
  editItem: (id: string, newTitle: string) => void;
  removeItem: (id: string) => void;
  setItemCompleted: (id: string, completed: boolean) => void;
  toggleItemCompleted: (id: string) => void;
};

export const useTodoList = create<TodoListDataStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (title: string) => {
        // generate guid, add to items
        const newItem: TodoItem = {
          id: crypto.randomUUID(),
          title,
          completed: false,
        };
        set({ items: [...get().items, newItem] });
      },
      editItem: (id: string, newTitle: string) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, title: newTitle } : item,
          ),
        });
      },
      removeItem: (id: string) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      setItemCompleted: (id: string, completed: boolean) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, completed } : item,
          ),
        });
      },
      toggleItemCompleted: (id: string) => {
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, completed: !item.completed } : item,
          ),
        });
      },
    }),
    { name: "wf-tracker-todo-list" },
  ),
);
