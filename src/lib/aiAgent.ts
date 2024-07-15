import { Action, State } from '@/store';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
	compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
});

const Id = z.string().uuid();

const AddTodoAction = z.object({
	todoListId: Id,
	title: z.string(),
});

const CompleteToDoAction = z.object({
	todoListId: Id,
	todoId: Id,
});

// TODO: agent can call multiple tools in a single response, remove multiple tools from the same response
// TODO: add actions to remove todos, todo lists, etc.
// TODO: maybe dont force agent to call a tool, let it decide

export async function askAgent(prompt: string, currentState: State, actions: Action) {
	const { text } = await generateText({
		model: openai('gpt-4-turbo'),
		prompt: `
		Execute the following: "${prompt}"
		Given the current state: ${JSON.stringify(currentState)}
		`,
		tools: {
			addTodoList: tool({
				description: 'Add a todo list',
				parameters: z.object({
					name: z.string(),
				}),
				execute: async ({ name }) => actions.addTodoList(name),
			}),

			addTodo: tool({
				description: 'Add a todo',
				parameters: AddTodoAction,
				execute: async ({ todoListId, title }) => actions.addTodo(todoListId, title),
			}),

			addTodos: tool({
				description: 'Add multiple todos',
				parameters: z.object({
					todos: z.array(AddTodoAction),
				}),
				execute: async ({ todos }) => actions.addTodos(todos),
			}),

			completeTodo: tool({
				description: 'Complete a todo',
				parameters: CompleteToDoAction,
				execute: async ({ todoListId, todoId }) => actions.completeTodo(todoListId, todoId),
			}),

			completeTodos: tool({
				description: 'Complete multiple todos',
				parameters: z.object({
					todos: z.array(CompleteToDoAction),
				}),
				execute: async ({ todos }) => actions.completeTodos(todos),
			}),

			dragDropTodoReorder: tool({
				description: 'Reorder todos in drag and drop fashion',
				parameters: z.object({
					todoListId: Id,
					sourceIndex: z.number(),
					destinationIndex: z.number(),
				}),
				execute: async ({ todoListId, sourceIndex, destinationIndex }) =>
					actions.dragDropTodoReorder(todoListId, sourceIndex, destinationIndex),
			}),

			reorder: tool({
				description: 'Reorder todos by specifying if of the list and new order of todo ids',
				parameters: z.object({
					todoListId: Id,
					newOrder: z.array(Id),
				}),
				execute: async ({ todoListId, newOrder }) => actions.reorder(todoListId, newOrder),
			}),
		},
		toolChoice: 'required', // force the model to call a tool
	});

	console.log(text);
}
