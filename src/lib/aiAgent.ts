import { Action, State } from '@/store';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
	compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
});

const Id = z.string().uuid();

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
				description: 'Create empty todo list by giving it a name',
				parameters: z.object({
					name: z.string(),
				}),
				execute: async ({ name }) => actions.addTodoList(name),
			}),

			removeTodoList: tool({
				description: 'Remove todo list by providing its id',
				parameters: z.object({
					todoListId: Id,
				}),
				execute: async ({ todoListId }) => actions.removeTodoList(todoListId),
			}),

			addTodo: tool({
				description: 'Add a todo and assign it to a todo list',
				parameters: z.object({
					todoListId: Id,
					title: z.string(),
				}),
				execute: async ({ todoListId, title }) => actions.addTodo(todoListId, title),
			}),

			removeTodo: tool({
				description: 'Remove todo by providing its id',
				parameters: z.object({
					todoId: Id,
				}),
				execute: async ({ todoId }) => actions.removeTodo(todoId),
			}),

			addTodoListWithTodos: tool({
				description: 'Create a todo list with multiple todos',
				parameters: z.object({
					name: z.string(),
					todoTitles: z.array(z.string()),
				}),
				execute: async ({ name, todoTitles }) => actions.addTodoListWithTodos(name, todoTitles),
			}),

			completeTodo: tool({
				description: 'Will compelete selected todo.',
				parameters: z.object({
					todoId: Id,
				}),
				execute: async ({ todoId }) => actions.completeTodo(todoId),
			}),

			dragDropTodoReorder: tool({
				description: 'You can specify two ids of todos that should swap places.',
				parameters: z.object({
					sourceId: Id,
					destinationId: Id,
				}),
				execute: async ({ sourceId, destinationId }) => actions.dragDropTodoReorder(sourceId, destinationId),
			}),

			// TODO: when agent forgets an id, it gets removed by the action ATM
			reorder: tool({
				description: 'Reorder todos by specifying new order of todo ids.',
				parameters: z.object({
					newOrder: z.array(Id),
				}),
				execute: async ({ newOrder }) => actions.reorder(newOrder),
			}),
		},
		toolChoice: 'required', // force the model to call a tool
	});

	console.log(text);
}
