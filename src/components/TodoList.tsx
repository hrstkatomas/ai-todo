import { type TodoList as TodoListType, useStore } from "@/store";
import { Todo } from "@/components/Todo";
import classNames from "classnames";

interface TodoListProps extends TodoListType {}

export function TodoList({ id, name, todos }: TodoListProps) {
	const completeTodo = useStore((actions) => actions.completeTodo.bind(null, id));
	const reorder = useStore((actions) => actions.dragDropTodoReorder.bind(null, id));

	return (
		<div key={id} className={classNames("bg-white", "rounded-lg", "shadow-md", "p-4")}>
			<h2 className={classNames("text-lg", "font-bold", "mb-4")}>{name}</h2>
			<div className={classNames("space-y-4")}>
				{todos.map((todo, index) => (
					<Todo
						{...todo}
						index={index}
						key={todo.id}
						handleDragDrop={reorder}
						handleTodoComplete={() => completeTodo(todo.id)}
					/>
				))}
			</div>
		</div>
	);
}
