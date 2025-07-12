// components/Header.tsx
'use client';

import { useState } from 'react';
import { useTodos } from '@/hooks/useTodos';
import { useTodoStore } from '@/hooks/todos.store';
import './Header.css';

export default function Header() {
  const [input, setInput] = useState('');
  const { fetchTodosByKeyword } = useTodos();
  const { setKeyword } = useTodoStore();

  const handleSubmit = () => {
    if (!input.trim()) return;
    setKeyword(input);
    fetchTodosByKeyword(input);
  };

  return (
    <header className='header'>
      <h1 className='title'>Список дел</h1>
      <div className='inputGroup'>
        <input
          type="text"
          placeholder="Введите кодовое слово"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className='input'
        />
        <button onClick={handleSubmit} className='button'>
          Загрузить
        </button>
      </div>
    </header>
  );
}
