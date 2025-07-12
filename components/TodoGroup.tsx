// // components/TodoGroup.tsx

// 'use client';

// import { useState } from 'react';
// import { Todo } from '@/types/todo';
// import { TodoItem } from './TodoItem';

// interface Props {
//   group: Todo;
//   children: Todo[];
// }

// export function TodoGroup({ group, children }: Props) {
//   const [expanded, setExpanded] = useState(true);

//   return (
//     <div className="border rounded p-2 mb-3">
//       <div
//         className="flex justify-between items-center cursor-pointer"
//         onClick={() => setExpanded(!expanded)}
//       >
//         <span className="font-bold">{group.title}</span>
//         <button className="text-sm text-blue-500">{expanded ? '▾' : '▸'}</button>
//       </div>

//       {expanded && (
//         <div className="pl-4 pt-2 space-y-2">
//           {children.map((todo) => (
//             <TodoItem key={todo.id} todo={todo} isChild />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }
