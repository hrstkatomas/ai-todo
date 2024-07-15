import { TodoInput } from '@/components/TodoInput';
import { TodoList } from '@/components/TodoList';
import { VoiceInput } from '@/components/VoiceInput';
import { useStore } from '@/store';
import { clsx } from 'clsx';

export function App() {
	const todoLists = useStore((state) => state.todoLists);
	const todos = useStore((state) => state.todos);

	const todoListIds = todoLists.map(({ id }) => id);
	const orphanedTodos = todos.filter((todo) => !todoListIds.includes(todo.parentId));

	return (
		<div className={clsx('flex', 'flex-col', 'h-screen')}>
			<header className={clsx('bg-gray-900', 'text-white', 'py-4', 'px-6')}>
				<div className={clsx('flex', 'items-center', 'justify-between')}>
					<h1 className={clsx('text-2xl', 'font-bold')}>Todo List</h1>
					<div className={clsx('flex', 'items-center', 'space-x-2')}>
						<TodoInput />
						<VoiceInput />
					</div>
				</div>
			</header>
			<div
				className={clsx(
					'flex-1',
					'overflow-auto',
					'p-6',
					'grid',
					'grid-cols-[repeat(auto-fit,minmax(300px,1fr))]',
					'gap-6',
				)}
			>
				{todoLists.map((todoList) => (
					<TodoList
						key={todoList.id}
						{...todoList}
						todos={todos.filter((todo) => todo.parentId === todoList.id)}
					/>
				))}

				{Boolean(orphanedTodos.length) && (
					<TodoList key={'orphans'} id={'orphans'} name={'Orphans'} todos={orphanedTodos} />
				)}
			</div>
		</div>
	);
}
