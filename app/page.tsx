// app/page.tsx
'use client';

import React from 'react';
import Header from '@/components/Header';
import {TodoList} from '@/components/TodoList';
import AddTodoForm from '@/components/AddTodoForm';
import { useTodoStore } from '@/hooks/todos.store';

export default function Home() {
  const { todos } = useTodoStore();

  return (
    <div className='container'>
      <Header />
      
      <AddTodoForm />
      { todos.length > 0 && <TodoList />}
      {todos.length === 0 && (
        <p className='status'>Нет дел по данному ключу</p>
      )}
    </div>
  );
}
