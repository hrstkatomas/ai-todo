import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useStore } from "@/store";
import { clsx } from "clsx";

export function TodoInput() {
	const [newTodoTitle, setNewTodoTitle] = useState("");

	const todoLists = useStore((state) => state.todoLists);
	const addTodo = useStore((actions) => actions.addTodo.bind(null, todoLists[0].id));

	// TODO: this adds to the first list only for now. Redo this
	const handleNewTodoSubmit = () => addTodo(newTodoTitle);

	return (
		<>
			<Input
				type="text"
				placeholder="Add new todo"
				value={newTodoTitle}
				onChange={(e) => setNewTodoTitle(e.target.value)}
				onKeyDown={(e) => {
					if (e.key === "Enter") handleNewTodoSubmit();
				}}
				className={clsx("bg-gray-800", "text-white", "px-4", "py-2", "rounded-md")}
			/>
			<button
				onClick={handleNewTodoSubmit}
				className={clsx("bg-gray-800", "hover:bg-gray-700", "text-white", "px-4", "py-2", "rounded-md")}
			>
				<PlusIcon className="h-6 w-6" />
			</button>
		</>
	);
}

function PlusIcon(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			{...props}
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}
