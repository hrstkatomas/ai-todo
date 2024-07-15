import { Checkbox } from '@/components/ui/checkbox';
import { clsx } from 'clsx';
import { Id, type Todo as TodoType } from '../store';

export interface TodoProps extends TodoType {
	handleDragDrop: (dropIndex: Id, initialIndex: Id) => void;
	handleTodoComplete: () => void;
}

export function Todo({ id, title, completed, handleDragDrop, handleTodoComplete }: TodoProps) {
	return (
		<div
			key={id}
			className={clsx(
				`bg-gray-100`,
				`rounded-lg`,
				`p-4`,
				`cursor-move`,
				`flex`,
				`items-center`,
				`justify-between`,
				{ 'opacity-50': completed },
			)}
			draggable
			onDragStart={(e) => e.dataTransfer.setData('text/plain', id)}
			onDragOver={(e) => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault();
				handleDragDrop(e.dataTransfer.getData('text/plain'), id);
			}}
		>
			<div className={clsx('flex', 'items-center')}>
				<Checkbox id={`todo-${id}`} checked={completed} onCheckedChange={handleTodoComplete} />
				<label
					htmlFor={`todo-${id}`}
					className={clsx(`ml-3`, `text-lg`, `font-bold`, { 'line-through text-gray-500': completed })}
				>
					{title}
				</label>
			</div>
		</div>
	);
}
