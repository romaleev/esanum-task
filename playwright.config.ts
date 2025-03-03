import dotenv from 'dotenv'
import { defineConfig } from '@playwright/test'

const devEnv = dotenv.config({ path: './common/.env' })
const prodEnv = dotenv.config({ path: './common/.env.production' })

export default defineConfig({
	testDir: './common/e2e',
	timeout: 30000, // 60 seconds timeout
	fullyParallel: true,
	reporter: [['html', { outputFolder: 'playwright-report' }]],
	use: {
		headless: true, // Set to false to see the browser UI
		viewport: { width: 1280, height: 720 },
		actionTimeout: 10000,
		trace: 'on',
		video: 'on',
		screenshot: 'only-on-failure',
	},
	projects: [
		{
			name: 'local',
			outputDir: 'test-results/local',
			use: {
				baseURL: `http://localhost:${devEnv.parsed.CLIENT_PORT}`,
			},
		},
		{
			name: 'docker',
			outputDir: 'test-results/docker',
			use: {
				baseURL: `http://localhost:${prodEnv.parsed.CLIENT_PORT}`,
			},
		},
	],
})
