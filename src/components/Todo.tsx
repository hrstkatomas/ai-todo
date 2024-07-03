import { Checkbox } from '@/components/ui/checkbox';
import { clsx } from 'clsx';
import { type Todo as TodoType } from '../store';

export interface TodoProps extends TodoType {
	index: number;
	handleDragDrop: (dropIndex: number, initialIndex: number) => void;
	handleTodoComplete: () => void;
}

export function Todo({ id, index, title, completed, handleDragDrop, handleTodoComplete }: TodoProps) {
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
			onDragStart={(e) => e.dataTransfer.setData('text/plain', String(index))}
			onDragOver={(e) => e.preventDefault()}
			onDrop={(e) => {
				e.preventDefault();
				const dropIndex = parseInt(e.dataTransfer.getData('text/plain'));
				handleDragDrop(dropIndex, index);
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
