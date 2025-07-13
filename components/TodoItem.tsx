'use client';

import React, { useState, useEffect } from 'react';
import { useSortable, AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types/todo';
import './TodoItem.css';
import { useTodos } from '@/hooks/useTodos';

interface Props {
  todo: Todo;
  isSelected: boolean;
  onClick: () => void;
  animateLayoutChanges?: AnimateLayoutChanges;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isSelected,
  onClick,
  animateLayoutChanges,
}) => {
  const { handleComplete, handleDelete, handleEdit } = useTodos();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: todo.id,
    animateLayoutChanges,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    cursor: isDragging ? 'grabbing' : 'pointer',
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragging ? '#ffffffff' : '#ecececff',
    scale: isDragging ? 1.05 : 1,
    rotate: isDragging ? '-2deg' : "0deg",
    position: 'relative',
    zIndex: isDragging ? 1000 : 1,
  };

  const handleCompleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Complete button clicked');
    handleComplete(todo.id, !todo.completed);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const newTitle = prompt('Новое название:', todo.title);
    if (newTitle && newTitle.trim() !== todo.title) {
      handleEdit(todo.id, newTitle.trim());
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm('Удалить это дело?')) {
      handleDelete(todo.id);
    }
  };

  const handleItemClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return; // Не обрабатываем клики по кнопкам
    }
    onClick();
  };

  return (
    <div className='todoWrapper'>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners} // Оставляем только один раз
        onClick={handleItemClick}
        className={`todoitem ${isSelected ? 'selected' : ''}`}
      >
        <div className='todo'>
          <span className={todo.completed ? 'title_done' : 'title'}>
            {todo.title}
          </span>
        </div>
      </div>
      
      <div className={`${'actionsPanel'} ${isSelected && !isDragging ? 'actionsVisible' : ''}`}>
        <div className={'actions'}>
          <button
            onClick={handleCompleteClick}
            className='donebutton'
            type="button"
          >
            {todo.completed ? 'Восстановить' : 'Завершить'}
          </button>
          <button
            className='editbutton'
            onClick={handleEditClick}
            type="button"
          >
            Редактировать
          </button>
          <button
            className='deletebutton'
            onClick={handleDeleteClick}
            type="button"
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};