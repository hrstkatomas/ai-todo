import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';
import { pluginTypeCheck } from '@rsbuild/plugin-type-check';

export default defineConfig({
	plugins: [pluginReact(), pluginTypeCheck()],
	html: {
		template: './public/index.html',
	},
	output: {
		distPath: {
			root: 'build',
		},
	},
});
