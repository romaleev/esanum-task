import { Component, NgZone } from '@angular/core'
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'

@Component({
	selector: 'app-upload',
	templateUrl: './upload.component.html',
	styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
	selectedFile: File | null = null
	jobId: string | null = null
	gifUrl: string | null = null
	loading = false

	constructor(
		private http: HttpClient,
		private snackBar: MatSnackBar,
		private ngZone: NgZone,
	) {}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0]
		}
		input.value = ''
	}

	uploadFile(): void {
		if (!this.selectedFile) return
		this.loading = true
		const formData = new FormData()
		formData.append('file', this.selectedFile)

		this.http
			.post<{ jobId: string }>('/api/upload', formData, {
				reportProgress: true,
				observe: 'events',
			})
			.subscribe({
				next: (event: HttpEvent<{ jobId: string }>) => {
					if (event.type === HttpEventType.Response) {
						this.jobId = event.body?.jobId || null
						this.sseJobStatus()
					}
				},
				error: (error) => {
					this.loading = false
					let errorMessage = 'An unexpected error occurred.'

					if (error.status === 400) {
						errorMessage = error.error?.error || 'Invalid file format or file too large.'
					} else if (error.status === 413) {
						errorMessage = 'File is too large. Please upload a smaller file.'
					} else if (error.status === 500) {
						errorMessage = 'Server error. Please try again later.'
					}

					this.snackBar.open(`❌ Upload Failed: ${errorMessage}`, 'Close', {
						duration: 5000,
					})
				},
			})
	}

	sseJobStatus(): void {
		if (!this.jobId) return

		// Create an EventSource for SSE
		const eventSource = new EventSource(`/api/status/${this.jobId}`)

		eventSource.onmessage = (event) => {
			this.ngZone.run(() => {
				const response: { status: string; gifUrl?: string; error?: string } = JSON.parse(event.data)

				if (response.status === 'completed' && response.gifUrl) {
					this.gifUrl = response.gifUrl
					this.loading = false
					this.selectedFile = null
					// this.snackBar.open('🎉 GIF conversion complete!', 'Close', { duration: 3000 })
					eventSource.close() // Stop listening once done
				} else if (response.status === 'failed') {
					this.loading = false
					this.snackBar.open(
						`❌ Conversion Failed: ${response.error || 'Unknown error'}`,
						'Close',
						{
							duration: 5000,
						},
					)
					eventSource.close() // Stop listening on failure
				}
			})
		}

		eventSource.onerror = () => {
			this.ngZone.run(() => {
				// ✅ Ensure UI updates when an error occurs
				eventSource.close()
				this.snackBar.open('❌ Connection lost. Please try again.', 'Close', { duration: 5000 })
			})
		}
	}
}
