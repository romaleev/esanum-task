import { promises as fs } from 'fs'

export const exists = async (filePath: string): Promise<boolean> => {
	try {
		await fs.access(filePath)
		return true
	} catch {
		return false
	}
}
