// src/hooks/todos.store.ts
import { create } from 'zustand';
import { Todo } from '@/types/todo';

type TodosState = {
  keyword: string | null;
  todos: Todo[];
  setKeyword: (keyword: string) => void;
  setTodos: (todos: Todo[]) => void;
  addTodo: (todo: Todo) => void;
  updateTodo: (updated: Todo) => void;
  removeTodo: (id: string) => void;
  clearTodos: () => void;
};

export const useTodoStore = create<TodosState>((set) => ({
  keyword: null,
  todos: [],
  setKeyword: (keyword) => set({ keyword }),
  setTodos: (todos) => set({ todos }),
  addTodo: (todo) =>
    set((state) => ({ todos: [...state.todos, todo] })),
  updateTodo: (updated) =>
    set((state) => ({
      todos: state.todos.map((t) => (t.id === updated.id ? updated : t)),
    })),
  removeTodo: (id) =>
    set((state) => ({
      todos: state.todos.filter((t) => t.id !== id),
    })),
  clearTodos: () => set({ todos: [], keyword: null }),
}));
