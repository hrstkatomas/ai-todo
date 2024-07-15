import { splitArrayByIdentifiable } from '@/lib/splitArrayByIdentifiable';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type Id = string;

export type Identifiable = {
	id: Id;
};

export type Todo = Identifiable & {
	title: string;
	completed: boolean;
	parentId: Id;
};

export type TodoList = Identifiable & {
	name: string;
};

export type State = {
	todoLists: TodoList[];
	todos: Todo[];
};

export type Action = {
	addTodoList: (name: string) => void;
	removeTodoList: (id: Id) => void;
	addTodo: (todoListId: Id, title: string) => void;
	removeTodo: (id: Id) => void;
	addTodoListWithTodos: (name: string, todoTitles: string[]) => void;
	completeTodo: (todoId: Id) => void;
	dragDropTodoReorder: (sourceIndex: Id, destinationIndex: Id) => void;
	reorder: (newOrder: Id[]) => void;
};

const initialId = uuidv4();
const initialState: State = {
	todoLists: [
		{
			id: initialId,
			name: 'Me',
		},
	],
	todos: [
		{
			id: uuidv4(),
			title: 'Finish project proposal',
			completed: false,
			parentId: initialId,
		},
	],
};

export const useStore = create<State & Action>((set, get) => ({
	...initialState,

	addTodoList: (name) =>
		set((state) => ({ ...state, todoLists: [...state.todoLists, { id: uuidv4(), name, todos: [] }] })),

	removeTodoList: (id) =>
		set((state) => {
			const [startOfTodoLists, _, endOfTodoLists] = splitArrayByIdentifiable(state.todoLists, id);
			return { ...state, todoLists: [...startOfTodoLists, ...endOfTodoLists] };
		}),

	addTodo: (todoListId, title) =>
		set((state) => {
			return {
				...state,
				todos: [
					...state.todos,
					{
						id: uuidv4(),
						completed: false,
						title: title,
						parentId: todoListId,
					},
				],
			};
		}),

	removeTodo: (id) =>
		set((state) => {
			const [startOfTodos, _, endOfTodos] = splitArrayByIdentifiable(state.todos, id);
			return { ...state, todos: [...startOfTodos, ...endOfTodos] };
		}),

	addTodoListWithTodos: (name, todoTitles) => {
		get().addTodoList(name);
		const todoLists = get().todoLists;
		const addedTodoListId = todoLists[todoLists.length - 1].id;
		todoTitles.forEach((title) => get().addTodo(addedTodoListId, title));
	},

	completeTodo: (todoId) =>
		set((state) => {
			{
				const [startOfTodos, todoToComplete, endOfTodos] = splitArrayByIdentifiable(state.todos, todoId);

				return {
					...state,
					todos: [
						...startOfTodos,
						{
							...todoToComplete,
							completed: !todoToComplete.completed,
						},
						...endOfTodos,
					],
				};
			}
		}),

	dragDropTodoReorder: (sourceId, destinationId) =>
		set((state) => {
			// Mutations are yucky... but splice has convinient interface for this
			const updatedTodos = [...state.todos];

			const sourceIndex = updatedTodos.findIndex((todo) => todo.id === sourceId);
			const destinationIndex = updatedTodos.findIndex((todo) => todo.id === destinationId);

			const [removed] = updatedTodos.splice(sourceIndex, 1);
			updatedTodos.splice(destinationIndex, 0, removed);

			return {
				...state,
				todos: updatedTodos,
			};
		}),

	reorder: (newOrder) =>
		set((state) => {
			return {
				...state,
				todos: newOrder
					.map((todoId) => state.todos.find((todo) => todo.id === todoId))
					.filter((todo): todo is Todo => todo !== undefined),
			};
		}),
}));
