import * as path from 'path';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({command, mode}) => {
	const env = loadEnv(mode, path.resolve(process.cwd(), '../'), '');
	return {
		plugins: [sveltekit()],
		envDir: '../',
		server: {
			port: +env?.FRONTEND_PORT || 3001,
		}
	}
});
