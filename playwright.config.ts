import { defineConfig } from '@playwright/test'

export default defineConfig({
	testDir: './e2e',
	timeout: 60000, // 60 seconds timeout
	fullyParallel: true,
	reporter: [['html', { outputFolder: 'playwright-report' }]],
	use: {
		headless: true, // Set to false to see the browser UI
		viewport: { width: 1280, height: 720 },
		baseURL: 'http://localhost:4200', // Change to 3000 if testing directly on Express
		actionTimeout: 10000,
		trace: 'on',
		video: 'on',
		screenshot: 'only-on-failure',
	},
	webServer: {
		command: 'npm start',
		port: 4200,
		timeout: 120000, // Wait for the app to start
		reuseExistingServer: true,
	},
})
