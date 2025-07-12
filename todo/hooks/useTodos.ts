import { supabase } from '@/lib/supabaseClient';
import { useTodoStore } from './todos.store';
import { Todo } from '@/types/todo';

export function useTodos() {
  const { keyword, todos, setTodos } = useTodoStore();

  // Загрузка дел по ключевому слову
  const fetchTodosByKeyword = async (word: string) => {
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('keyword', word)
      .order('order', { ascending: true });

    if (error) {
      console.error('Ошибка загрузки дел:', error.message);
      return;
    }

    if (data) {
      setTodos(data as Todo[]);
    }
  };

  // Завершение / восстановление
  const handleComplete = async (id: string, newValue: boolean) => {
    const { error } = await supabase
      .from('todos')
      .update({ completed: newValue })
      .eq('id', id);

    if (!error) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, completed: newValue } : t
        )
      );
    } else {
      console.error('Ошибка при завершении дела:', error.message);
    }
  };

  // Удаление
  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('todos').delete().eq('id', id);
    if (!error) {
      setTodos(todos.filter((t) => t.id !== id));
    } else {
      console.error('Ошибка при удалении дела:', error.message);
    }
  };

  // Редактирование
  const handleEdit = async (id: string, newTitle: string) => {
    const { error } = await supabase
      .from('todos')
      .update({ title: newTitle })
      .eq('id', id);

    if (!error) {
      setTodos(
        todos.map((t) =>
          t.id === id ? { ...t, title: newTitle } : t
        )
      );
    } else {
      console.error('Ошибка при редактировании дела:', error.message);
    }
  };

  // Смена порядка
  const handleReorder = async (reordered: Todo[]) => {
    // 1. Сначала обновляем локальное состояние оптимистично
    const updated = reordered.map((todo, i) => ({ ...todo, order: i }));
    setTodos(updated);

    // 2. Затем синхронизируем с сервером
    try {
      for (let i = 0; i < reordered.length; i++) {
        const todo = reordered[i];
        const { error } = await supabase
          .from('todos')
          .update({ order: i })
          .eq('id', todo.id);

        if (error) {
          console.error(`Ошибка обновления порядка для ${todo.id}:`, error.message);
          // При ошибке можно откатить изменения или показать уведомление
          throw error;
        }
      }
    } catch (error) {
      // При ошибке откатываем изменения
      console.error('Ошибка при обновлении порядка:', error);
      // Можно вернуть старое состояние или показать уведомление пользователю
      // setTodos(previousTodos); // если сохранили предыдущее состояние
    }
  };



  // Объединение в группу
  const handleGroup = async (childId: string, parentId: string) => {
    const { error } = await supabase
      .from('todos')
      .update({ parent_id: parentId })
      .eq('id', childId);

    if (error) {
      console.error('Ошибка при группировке:', error.message);
    } else {
      const updated = todos.map((t) =>
        t.id === childId ? { ...t, parent_id: parentId } : t
      );
      setTodos(updated);
    }
  };

  // Список групп и отдельных дел
  const getGroupedTodos = () => {
    const groups: Todo[] = todos.filter((t) => !t.parent_id && !t.completed);
    const children: Record<string, Todo[]> = {};

    todos.forEach((t) => {
      if (t.parent_id && !t.completed) {
        if (!children[t.parent_id]) children[t.parent_id] = [];
        children[t.parent_id].push(t);
      }
    });

    return { groups, children };
  };

  return {
    todos,
    fetchTodosByKeyword,
    handleComplete,
    handleDelete,
    handleEdit,
    handleReorder,
    handleGroup,
    getGroupedTodos,
  };
}
