interface ImportMetaEnv {
	readonly PUBLIC_OPENAI_API_KEY: string;
}

// biome-ignore lint/correctness/noUnusedVariables: <explanation>
interface ImportMeta {
	readonly env: ImportMetaEnv;
}
