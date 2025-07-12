export type Todo = {
  id: string;
  title: string;
  keyword: string;
  completed: boolean;
  order: number;
  parent_id: string | null;
  created_at?: string;
};
