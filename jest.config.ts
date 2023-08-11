import type { Config } from '@jest/types'

const config: Config.InitialOptions = {
	verbose: true,
	transform: {
		'^.+\\.tsx?$': ['ts-jest', { diagnostics: { ignoreCodes: ['TS151001'] } }]
	},
}
export default config
