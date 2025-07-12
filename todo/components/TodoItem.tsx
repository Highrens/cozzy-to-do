'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from '@/types/todo';

interface Props {
  todo: Todo;
  isSelected: boolean;
  onClick: () => void;
  onComplete: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export const TodoItem: React.FC<Props> = ({
  todo,
  isSelected,
  onClick,
  onComplete,
  onEdit,
  onDelete,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: todo.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: 'grab',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className='todoitem'
    >
      <div className="flex justify-between items-center">
        <span>{todo.title}</span>
        {isSelected && (
          <div className="space-x-2 ml-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onComplete();
              }}
            >
              ✅
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              ✏️
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
