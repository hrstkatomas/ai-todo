import { splitArrayByIdentifiable } from '@/lib/splitArrayByIdentifiable';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type Id = string;

type Identifiable = {
	id: Id;
};

export type Todo = Identifiable & {
	title: string;
	completed: boolean;
};

export type TodoList = Identifiable & {
	name: string;
	todos: Todo[];
};

export type State = {
	todoLists: TodoList[];
};

export type Action = {
	addTodoList: (name: string) => void;
	addTodo: (todoListId: Id, title: string) => void;
	completeTodo: (todoListId: Id, todoId: Id) => void;
	dragDropTodoReorder: (todoListId: Id, sourceIndex: number, destinationIndex: number) => void;
};

const initialState: State = {
	todoLists: [
		{
			id: uuidv4(),
			name: 'John',
			todos: [
				{
					id: uuidv4(),
					title: 'Finish project proposal',
					completed: false,
				},
			],
		},
	],
};

export const useStore = create<State & Action>((set) => ({
	...initialState,

	addTodoList: (name) =>
		set((state) => ({ ...state, todoLists: [...state.todoLists, { id: uuidv4(), name, todos: [] }] })),

	// addTodo: (todoListId, title) => get().dispatch({ type: 'ADD_TODO', todoListId, title }),
	addTodo: (todoListId, title) =>
		set((state) => {
			const [startOfList, todoListToAlter, endOfList] = splitArrayByIdentifiable(state.todoLists, todoListId);

			const newMiddleTodoList: TodoList = {
				...todoListToAlter,
				todos: [
					...todoListToAlter.todos,
					{
						id: uuidv4(),
						completed: false,
						title: title,
					},
				],
			};

			return { ...state, todoLists: [...startOfList, newMiddleTodoList, ...endOfList] };
		}),

	completeTodo: (todoListId, todoId) =>
		set((state) => {
			{
				const [startOfTodoList, todoListToAlter, endOfTodoList] = splitArrayByIdentifiable(
					state.todoLists,
					todoListId,
				);

				const [startOfTodos, todoToComplete, endOfTodos] = splitArrayByIdentifiable(
					todoListToAlter.todos,
					todoId,
				);

				const newMiddleTodoList: TodoList = {
					...todoListToAlter,
					todos: [
						...startOfTodos,
						{
							...todoToComplete,
							completed: !todoToComplete.completed,
						},
						...endOfTodos,
					],
				};

				return { ...state, todoLists: [...startOfTodoList, newMiddleTodoList, ...endOfTodoList] };
			}
		}),

	dragDropTodoReorder: (todoListId, sourceIndex, destinationIndex) =>
		set((state) => {
			const [startOfList, todoListToAlter, endOfList] = splitArrayByIdentifiable(state.todoLists, todoListId);

			// Mutations are yucky... but splice has convinient interface for this
			const updatedTodos = [...todoListToAlter.todos];
			const [removed] = updatedTodos.splice(sourceIndex, 1);
			updatedTodos.splice(destinationIndex, 0, removed);

			const newMiddleTodoList: TodoList = {
				...todoListToAlter,
				todos: updatedTodos,
			};

			return { ...state, todoLists: [...startOfList, newMiddleTodoList, ...endOfList] };
		}),
}));
