// app/page.tsx
'use client';

import styles from './page.module.css';
import Header from '@/components/Header';
import {TodoList} from '@/components/TodoList';
import AddTodoForm from '@/components/AddTodoForm';
import { useTodoStore } from '@/hooks/todos.store';

export default function Home() {
  const { todos, loading } = useTodoStore();

  return (
    <div className={styles.container}>
      <Header />
      
      <AddTodoForm />

      {loading && <p className={styles.status}>Загрузка...</p>}
      
      {!loading && todos.length > 0 && <TodoList />}
      {!loading && todos.length === 0 && (
        <p className={styles.status}>Нет дел по данному ключу</p>
      )}
    </div>
  );
}
