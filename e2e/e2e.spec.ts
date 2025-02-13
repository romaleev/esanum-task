import { test, expect } from '@playwright/test'
import path from 'path'
import { Page } from 'playwright'

const inputFileLocator = 'input[type="file"]'

const mp4File = path.resolve('./server/tests/fixtures/sample_1024_10SEC.mp4')
const largeResolutionFile = path.resolve('./server/tests/fixtures/sample_1280_10SEC.mp4')
const longDurationFile = path.resolve('./server/tests/fixtures/sample_1024_15SEC.mp4')

async function uploadVirtualFile(
	page: Page,
	file: { name: string; type: string; size: number },
): Promise<void> {
	await page.evaluate(({ name, type, size }) => {
		const input = document.querySelector('input[type="file"]') as HTMLInputElement
		if (!input) throw new Error('File input not found')

		const dataTransfer = new DataTransfer()
		const content = 'a'.repeat(size) // Simulated file content
		const blob = new Blob([content], { type })
		const virtualFile = new File([blob], name, { type })
		dataTransfer.items.add(virtualFile)

		input.files = dataTransfer.files
		input.dispatchEvent(new Event('change', { bubbles: true }))
	}, file)
}

test.describe('MP4 to GIF Conversion - End-to-End Tests', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/')
	})

	test('✅ User can upload an MP4 file and receive a GIF', async ({ page }) => {
		const fileInput = page.locator(inputFileLocator)

		await fileInput.setInputFiles(mp4File)
		await page.getByRole('button', { name: 'Upload' }).click()

		const gifPreview = page.locator('img')
		await expect(gifPreview).toBeVisible({ timeout: 60000 })

		const gifUrl = await gifPreview.getAttribute('src')
		expect(gifUrl).toMatch(/\/api\/gif\/.*\.gif$/)

		console.log(`✅ Test passed: Generated GIF - ${gifUrl}`)
	})

	test('❌ User cannot upload a non-MP4 file', async ({ page }) => {
		await uploadVirtualFile(page, { name: 'video.avi', type: 'video/x-msvideo', size: 1024 * 512 })

		await expect(page.locator('.cdk-overlay-container')).toContainText(
			'❌ Invalid file format. Only MP4 is allowed.',
			{ timeout: 5000 },
		)

		console.log('✅ Test passed: Non-MP4 file correctly rejected')
	})

	test('❌ User cannot upload an MP4 file larger than 10MB', async ({ page }) => {
		await uploadVirtualFile(page, { name: 'large.mp4', type: 'video/mp4', size: 11 * 1024 * 1024 }) // 11MB file

		await expect(page.locator('.cdk-overlay-container')).toContainText(
			'❌ File is too large. Max 10MB allowed.',
			{ timeout: 5000 },
		)

		console.log('✅ Test passed: Large MP4 file correctly rejected')
	})

	test('❌ Handles server error when upload fails', async ({ page, context }) => {
		// Intercept and mock a 500 server error for the upload request
		await context.route('/api/upload', async (route) => {
			await route.fulfill({ status: 500, body: JSON.stringify({ error: 'Internal Server Error' }) })
		})

		const fileInput = page.locator('input[type="file"]')
		await fileInput.setInputFiles(mp4File)
		await page.getByRole('button', { name: 'Upload' }).click()

		await expect(page.locator('.cdk-overlay-container')).toContainText(
			'❌ Upload Failed: Server error. Please try again later.',
			{ timeout: 5000 },
		)

		console.log('✅ Test passed: Server error during upload handled correctly')
	})

	// ✅ New Test: Rejects file with too high resolution
	test('❌ User cannot upload a file with resolution higher than 1024x768', async ({ page }) => {
		const fileInput = page.locator(inputFileLocator)

		await fileInput.setInputFiles(largeResolutionFile)
		await page.getByRole('button', { name: 'Upload' }).click()

		await expect(page.locator('.cdk-overlay-container')).toContainText(
			'❌ Upload Failed: Resolution exceeds 1024x768 limit',
			{ timeout: 5000 },
		)

		console.log('✅ Test passed: High-resolution file correctly rejected')
	})

	// ✅ New Test: Rejects file with duration longer than 10 seconds
	test('❌ User cannot upload a file longer than 10 seconds', async ({ page }) => {
		const fileInput = page.locator(inputFileLocator)

		await fileInput.setInputFiles(longDurationFile)
		await page.getByRole('button', { name: 'Upload' }).click()

		await expect(page.locator('.cdk-overlay-container')).toContainText(
			'❌ Upload Failed: Video duration exceeds 10 seconds limit',
			{ timeout: 5000 },
		)

		console.log('✅ Test passed: Long-duration file correctly rejected')
	})
})
