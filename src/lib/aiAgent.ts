import { Action, State } from '@/store';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
	compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
});

const Id = z.string().uuid();

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
				parameters: z.object({
					todoListId: Id,
					title: z.string(),
				}),
				execute: async ({ todoListId, title }) => actions.addTodo(todoListId, title),
			}),

			completedTodo: tool({
				description: 'Complete a todo',
				parameters: z.object({
					todoListId: Id,
					todoId: Id,
				}),
				execute: async ({ todoListId, todoId }) => actions.completeTodo(todoListId, todoId),
			}),

			reorder: tool({
				description: 'Reorder todos',
				parameters: z.object({
					todoListId: Id,
					sourceIndex: z.number(),
					destinationIndex: z.number(),
				}),
				execute: async ({ todoListId, sourceIndex, destinationIndex }) =>
					actions.dragDropTodoReorder(todoListId, sourceIndex, destinationIndex),
			}),
		},
		toolChoice: 'required', // force the model to call a tool
	});

	console.log(text);
}
