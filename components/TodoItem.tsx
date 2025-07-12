'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useSortable, AnimateLayoutChanges } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types/todo';
import styles from './TodoItem.module.css';
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
  const [isDragMode, setIsDragMode] = useState(false);
  const [isPointerDown, setIsPointerDown] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);

  // Получаем методы из хука useTodos
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
    // Используем transition от dnd-kit только когда НЕ активируем drag режим
    transition: isDragMode ? 'rotate 0.3s ease, scale 0.3s ease, background-color 0.3s ease' : transition,
    cursor: isDragMode ? 'grabbing' : 'pointer',
    rotate: isDragMode ? '-5deg' : "0deg",
    opacity: isDragging ? 0.8 : 1,
    backgroundColor: isDragMode ? '#ffffffff' : '#ecececff',
    scale: isDragMode ? 1.05 : 1,
    position: 'relative',
    zIndex: isDragMode ? 1000 : 1,
  };

  // Эффект для отслеживания окончания драга
  useEffect(() => {
    if (!isDragging && isDragMode) {
      setIsDragMode(false);
      setIsPointerDown(false);
    }
  }, [isDragging, isDragMode]);

  // Локальные обработчики для кнопок
  const handleCompleteClick = () => {
    handleComplete(todo.id, !todo.completed);
  };

  const handleEditClick = () => {
    const newTitle = prompt('Новое название:', todo.title);
    if (newTitle && newTitle.trim() !== todo.title) {
      handleEdit(todo.id, newTitle.trim());
    }
  };

  const handleDeleteClick = () => {
    if (confirm('Удалить это дело?')) {
      handleDelete(todo.id);
    }
  };

  const clearDragState = () => {
    setIsPointerDown(false);
    setIsDragMode(false);
    startPosRef.current = null;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    // Проверяем, что клик НЕ по кнопке
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    setIsPointerDown(true);
    startPosRef.current = { x: e.clientX, y: e.clientY };

    timeoutRef.current = setTimeout(() => {
      setIsDragMode(true);
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, 500);

    if (listeners.onPointerDown) {
      listeners.onPointerDown(e);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'BUTTON' || target.closest('button')) {
      return;
    }

    if (!isPointerDown || !startPosRef.current) return;

    const deltaX = Math.abs(e.clientX - startPosRef.current.x);
    const deltaY = Math.abs(e.clientY - startPosRef.current.y);

    if (deltaX > 10 || deltaY > 10) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    }

    if (listeners.onPointerMove) {
      listeners.onPointerMove(e);
    }
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isPointerDown) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (listeners.onPointerUp) {
      listeners.onPointerUp(e);
    }

    if (isDragMode) {
      clearDragState();
      return;
    }

    setIsPointerDown(false);

    if (!isDragging) {
      onClick();
    }
  };

  const handlePointerLeave = (e: React.PointerEvent) => {
    if (!isPointerDown) return;

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    if (!isDragMode) {
      setIsPointerDown(false);
    }
  };

  useEffect(() => {
    const handleGlobalPointerUp = () => {
      if (isPointerDown || isDragMode) {
        clearDragState();
      }
    };

    if (isPointerDown || isDragMode) {
      document.addEventListener('pointerup', handleGlobalPointerUp);
      document.addEventListener('pointercancel', handleGlobalPointerUp);
    }

    return () => {
      document.removeEventListener('pointerup', handleGlobalPointerUp);
      document.removeEventListener('pointercancel', handleGlobalPointerUp);
    };
  }, [isPointerDown, isDragMode]);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className={styles.todoWrapper}>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        className={`todoitem ${isSelected ? styles.selected : ''}`}
      >
        <div className={styles.todo}>
          <span className={todo.completed ? styles.title_done : styles.title}>
            {todo.title}
          </span>
        </div>
      </div>
      
      {/* Кнопки появляются под карточкой */}
      <div className={`${styles.actionsPanel} ${isSelected && !isDragMode ? styles.actionsVisible : ''}`}>
        <div className={styles.actions}>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleCompleteClick();
            }}
            className={styles.donebutton}
          >
            {todo.completed ? 'Восстановить' : 'Завершить'}
          </button>
          <button
            className={styles.editbutton}
            onClick={(e) => {
              e.stopPropagation();
              handleEditClick();
            }}
          >
            Редактировать
          </button>
          <button
            className={styles.deletebutton}
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteClick();
            }}
          >
            Удалить
          </button>
        </div>
      </div>
    </div>
  );
};