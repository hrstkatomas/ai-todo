import { Todo } from '@/components/Todo';
import { type TodoList as TodoListType, Todo as TodoType, useStore } from '@/store';
import { clsx } from 'clsx';

interface TodoListProps extends TodoListType {
	todos: TodoType[];
}

export function TodoList({ id, name, todos }: TodoListProps) {
	const completeTodo = useStore((actions) => actions.completeTodo);
	const reorder = useStore((actions) => actions.dragDropTodoReorder);

	return (
		<div key={id} className={clsx('bg-white', 'rounded-lg', 'shadow-md', 'p-4')}>
			<h2 className={clsx('text-lg', 'font-bold', 'mb-4')}>{name}</h2>
			<div className={clsx('space-y-4')}>
				{todos.map((todo) => (
					<Todo
						{...todo}
						key={todo.id}
						handleDragDrop={reorder}
						handleTodoComplete={() => completeTodo(todo.id)}
					/>
				))}
			</div>
		</div>
	);
}
