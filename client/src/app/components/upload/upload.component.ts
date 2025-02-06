import { Component } from '@angular/core'
import { HttpClient, HttpEvent, HttpEventType } from '@angular/common/http'
import { MatSnackBar } from '@angular/material/snack-bar'
import { interval, switchMap, takeWhile } from 'rxjs'

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
	) {}

	onFileSelected(event: Event): void {
		const input = event.target as HTMLInputElement
		if (input.files && input.files.length > 0) {
			this.selectedFile = input.files[0]
		}
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
			.subscribe((event: HttpEvent<{ jobId: string }>) => {
				if (event.type === HttpEventType.Response) {
					this.jobId = event.body?.jobId || null
					this.pollJobStatus()
				}
			})
	}

	pollJobStatus(): void {
		interval(3000)
			.pipe(
				switchMap(() =>
					this.http.get<{ status: string; gifUrl?: string; error?: string }>(
						`/api/status/${this.jobId}`,
					),
				),
				takeWhile(
					(response) => response.status !== 'completed' && response.status !== 'failed',
					true,
				),
			)
			.subscribe((response) => {
				if (response.status === 'completed' && response.gifUrl) {
					this.gifUrl = response.gifUrl
					this.loading = false
					this.snackBar.open('🎉 GIF conversion complete!', 'Close', { duration: 3000 })
				} else if (response.status === 'failed') {
					this.loading = false
					this.snackBar.open(
						`❌ Conversion Failed: ${response.error || 'Unknown error'}`,
						'Close',
						{
							duration: 5000,
						},
					)
				}
			})
	}
}
