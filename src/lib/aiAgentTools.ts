import { z } from 'zod';

// state shcemas
export const Id = z.string().uuid();

export const Identifiable = z.object({
	id: Id,
});

export const Todo = Identifiable.extend({
	title: z.string(),
	completed: z.boolean(),
});

export const TodoList = Identifiable.extend({
	name: z.string(),
	todos: z.array(Todo),
});

export const State = z.object({
	todoLists: z.array(TodoList),
});

// actions schemas
export const AddTodoListAction = z.object({
	type: z.literal('ADD_TODO_LIST'),
	name: z.string(),
});

export const AddTodoAction = z.object({
	type: z.literal('ADD_TODO'),
	todoListId: Id,
	title: z.string(),
});

export const CompleteTodoAction = z.object({
	type: z.literal('COMPLETE_TODO'),
	todoListId: Id,
	todoId: Id,
});

export const DragDropTodoReorderAction = z.object({
	type: z.literal('DRAG_DROP_TODO_REORDER'),
	todoListId: Id,
	sourceIndex: z.number(),
	destinationIndex: z.number(),
});

export const AllActions = z.union([AddTodoListAction, AddTodoAction, CompleteTodoAction, DragDropTodoReorderAction]);
