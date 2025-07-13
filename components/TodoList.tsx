'use client';

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  MouseSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  AnimateLayoutChanges,
  defaultAnimateLayoutChanges,
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

  // Настраиваем сенсоры для работы с мобильными устройствами
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 8,
    },
  });

  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: {
      delay: 500, // Увеличиваем задержку для четкого различия между tap и drag
      tolerance: 15,
    },
  });

  // Используем mouse и touch сенсоры для стабильной работы
  const sensors = useSensors(mouseSensor, touchSensor);

  const activeTodos = todos.filter((t) => !t.completed);
  const completedTodos = todos.filter((t) => t.completed);

  // Настройка анимаций для элементов
  const animateLayoutChanges: AnimateLayoutChanges = (args) => {
    const { isSorting, wasDragging } = args;
    
    // Анимируем все изменения макета, кроме случаев когда элемент активно перетаскивается
    if (isSorting || wasDragging) {
      return defaultAnimateLayoutChanges(args);
    }
    
    return true;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = activeTodos.findIndex((t) => t.id === active.id);
    const newIndex = activeTodos.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    // Переупорядочиваем только активные задачи
    const reorderedActiveTodos = arrayMove(activeTodos, oldIndex, newIndex);
    
    // Создаем новый полный список, сохраняя завершенные задачи
    const newTodos = [...reorderedActiveTodos, ...completedTodos];
    
    // Передаем полный список в handleReorder
    handleReorder(newTodos);
  };

  const handleTodoClick = (todoId: string) => {
    setSelectedId((prev) => (prev === todoId ? null : todoId));
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
              onClick={() => handleTodoClick(todo.id)}
              animateLayoutChanges={animateLayoutChanges}
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
              onClick={() => handleTodoClick(todo.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
};