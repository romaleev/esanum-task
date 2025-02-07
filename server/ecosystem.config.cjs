module.exports = {
	apps: [
		{
			name: 'server',
			script: 'dist/index.js',
			exec_mode: 'fork', // Single instance for the server
			instances: 1,
			autorestart: true,
			interpreter: 'node',
			watch: false,
			max_memory_restart: '500M',
			env: {
				NODE_ENV: 'production',
			},
		},
		{
			name: 'worker',
			script: 'dist/workers/gifWorker.js',
			exec_mode: 'fork', // Single worker per container
			instances: 1, // Only one worker per container
			wait_ready: true,
			autorestart: true,
			interpreter: 'node',
			max_memory_restart: '500M',
			env: {
				NODE_ENV: 'production',
			},
		},
	],
}
