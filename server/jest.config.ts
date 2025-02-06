import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	verbose: true,
	preset: 'ts-jest',
	testEnvironment: 'node',
	testMatch: ['**/server/**/*.spec.ts'],
	transform: {
		'^.+\\.tsx?$': [
			'ts-jest',
			{
				tsconfig: 'tsconfig.spec.json',
				diagnostics: { ignoreCodes: ['TS151001'] },
			},
		],
	},
}
export default config
