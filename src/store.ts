import { AllActions, Id, State, Todo, TodoList } from '@/lib/aiAgentTools';
import { splitArrayByIdentifiable } from '@/lib/splitArrayByIdentifiable';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';
import { create } from 'zustand';

export type Id = z.infer<typeof Id>;
type TodoList = z.infer<typeof TodoList>;
type State = z.infer<typeof State>;
type ReducerActions = z.infer<typeof AllActions>;

type Action = {
	dispatch: (args: ReducerActions) => void;

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

type Reducer = (state: State, action: ReducerActions) => State;

const reducer: Reducer = (state, action) => {
	switch (action.type) {
		case 'ADD_TODO_LIST':
			return { ...state, todoLists: [...state.todoLists, { id: uuidv4(), name: action.name, todos: [] }] };

		case 'ADD_TODO': {
			const [startOfList, todoListToAlter, endOfList] = splitArrayByIdentifiable(
				state.todoLists,
				action.todoListId,
			);

			const newMiddleTodoList: TodoList = {
				...todoListToAlter,
				todos: [
					...todoListToAlter.todos,
					{
						id: uuidv4(),
						completed: false,
						title: action.title,
					},
				],
			};

			return { ...state, todoLists: [...startOfList, newMiddleTodoList, ...endOfList] };
		}

		case 'COMPLETE_TODO': {
			{
				const [startOfTodoList, todoListToAlter, endOfTodoList] = splitArrayByIdentifiable(
					state.todoLists,
					action.todoListId,
				);

				const [startOfTodos, todoToComplete, endOfTodos] = splitArrayByIdentifiable(
					todoListToAlter.todos,
					action.todoId,
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
		}

		case 'DRAG_DROP_TODO_REORDER': {
			const [startOfList, todoListToAlter, endOfList] = splitArrayByIdentifiable(
				state.todoLists,
				action.todoListId,
			);

			// Mutations are yucky... but splice has convinient interface for this
			const updatedTodos = [...todoListToAlter.todos];
			const [removed] = updatedTodos.splice(action.sourceIndex, 1);
			updatedTodos.splice(action.destinationIndex, 0, removed);

			const newMiddleTodoList: TodoList = {
				...todoListToAlter,
				todos: updatedTodos,
			};

			return { ...state, todoLists: [...startOfList, newMiddleTodoList, ...endOfList] };
		}
	}
};

export const useStore = create<State & Action>((set, get) => ({
	...initialState,

	dispatch: (args: ReducerActions) => set((state) => reducer(state, args)),

	addTodoList: (name) => get().dispatch({ type: 'ADD_TODO_LIST', name }),
	addTodo: (todoListId, title) => get().dispatch({ type: 'ADD_TODO', todoListId, title }),
	completeTodo: (todoListId, todoId) => get().dispatch({ type: 'COMPLETE_TODO', todoListId, todoId }),
	dragDropTodoReorder: (todoListId, sourceIndex, destinationIndex) =>
		get().dispatch({ type: 'DRAG_DROP_TODO_REORDER', todoListId, sourceIndex, destinationIndex }),
}));
