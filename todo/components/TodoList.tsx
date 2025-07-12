'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoItem } from './TodoItem';
import { useTodos } from '@/hooks/useTodos';

export const TodoList = () => {
  const {
    todos,
    handleComplete,
    handleDelete,
    handleEdit,
    handleReorder,
  } = useTodos();

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (!over || active.id === over.id) return;

  const oldIndex = activeTodos.findIndex((t) => t.id === active.id);
  const newIndex = activeTodos.findIndex((t) => t.id === over.id);

  if (oldIndex === -1 || newIndex === -1) return;

  const reordered = arrayMove(activeTodos, oldIndex, newIndex);
  
  // Теперь handleReorder сам обновит состояние оптимистично
  handleReorder(reordered);
};

  return (
    <div className="mt-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={activeTodos.map((item) => item.id)}
          strategy={verticalListSortingStrategy}
        >
          {activeTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isSelected={selectedId === todo.id}
              onClick={() =>
                setSelectedId((prev) => (prev === todo.id ? null : todo.id))
              }
              onComplete={() => handleComplete(todo.id, true)}
              onEdit={() => {
                const newTitle = prompt('Новое название', todo.title);
                if (newTitle) handleEdit(todo.id, newTitle);
              }}
              onDelete={() => handleDelete(todo.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      {completedTodos.length > 0 && (
        <div className="mt-8">
          <h4 className="mb-2">Завершённые:</h4>
          {completedTodos.map((todo) => (
            <TodoItem
              key={todo.id}
              todo={todo}
              isSelected={selectedId === todo.id}
              onClick={() =>
                setSelectedId((prev) => (prev === todo.id ? null : todo.id))
              }
              onComplete={() => handleComplete(todo.id, false)}
              onEdit={() => {
                const newTitle = prompt('Новое название', todo.title);
                if (newTitle) handleEdit(todo.id, newTitle);
              }}
              onDelete={() => handleDelete(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
