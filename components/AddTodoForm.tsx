// components/AddTodoForm.tsx
'use client';

import { useState } from 'react';
import { useTodoStore } from '@/hooks/todos.store';
import { supabase } from '@/lib/supabaseClient';
import './AddTodoForm.css';
import { useTodos } from '@/hooks/useTodos';

export default function AddTodoForm() {
  const [text, setText] = useState('');
  const { keyword, todos, setTodos } = useTodoStore();
  const { fetchTodosByKeyword } = useTodos();

  const handleAdd = async () => {
    const trimmed = text.trim();
    if (!trimmed || !keyword) return;

    const { data, error } = await supabase.from('todos').insert({
      title: trimmed,
      completed: false,
      keyword,
      order: todos.length + 1,
    }).select();

    if (error) {
      console.error('Ошибка добавления задачи:', error.message);
    } else if (data && data.length > 0) {
      setTodos([...todos, data[0]]);
      setText('');
    }
  };

  return (
    <div className='form'>
      <input
        className='addinput'
        type="text"
        placeholder="Новое дело"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
      />
      <button className='addbutton' onClick={handleAdd}>Добавить</button>
    </div>
  );
}
