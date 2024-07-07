import { AllActions, State } from '@/lib/aiAgentTools';
import { createOpenAI } from '@ai-sdk/openai';
import { generateText, tool } from 'ai';
import { z } from 'zod';

const openai = createOpenAI({
	compatibility: 'strict', // strict mode, enable when using the OpenAI API
	apiKey: import.meta.env.PUBLIC_OPENAI_API_KEY,
});

export async function askAgent(
	prompt: string,
	currentState: z.infer<typeof State>,
	dispatch: (action: z.infer<typeof AllActions>) => void,
) {
	const { text } = await generateText({
		model: openai('gpt-4-turbo'),
		prompt: `
		Execute the following: "${prompt}"
		Given the current state: ${JSON.stringify(currentState)}
		`,
		tools: {
			updateState: tool({
				description: 'Provide one or more actions that will update the state according to the given prompt',
				parameters: z.object({ actions: z.array(AllActions) }),
				execute: async ({ actions }) => actions.map((action) => dispatch(action)),
			}),
		},
		toolChoice: 'required', // force the model to call a tool
	});

	console.log(text);
}
