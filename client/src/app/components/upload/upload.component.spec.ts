import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing'
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import {
	MatSnackBar,
	MatSnackBarModule,
	MatSnackBarRef,
	TextOnlySnackBar,
} from '@angular/material/snack-bar'
import { NO_ERRORS_SCHEMA } from '@angular/core'
import { NoopAnimationsModule } from '@angular/platform-browser/animations'
import { UploadComponent } from './upload.component'

export class MockEventSource {
	onmessage: ((event: MessageEvent) => void) | null = null
	onerror: (() => void) | null = null
	close = jasmine.createSpy('close')
	constructor(public url: string) {}
}

const mp4File = new File(['test'], 'video.mp4', { type: 'video/mp4' })
const aviFile = new File(['dummy'], 'video.avi', { type: 'video/x-msvideo' })
const largeFile = new File(['a'.repeat(11 * 1024 * 1024)], 'video.mp4', { type: 'video/mp4' })

describe('UploadComponent', () => {
	let component: UploadComponent
	let fixture: ComponentFixture<UploadComponent>
	let httpMock: HttpTestingController
	let snackBar: MatSnackBar

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [UploadComponent],
			imports: [HttpClientTestingModule, MatSnackBarModule, NoopAnimationsModule], // ✅ FIXED Animations
			providers: [MatSnackBar],
			schemas: [NO_ERRORS_SCHEMA],
			teardown: { destroyAfterEach: false },
		}).compileComponents()

		fixture = TestBed.createComponent(UploadComponent)
		component = fixture.componentInstance
		httpMock = TestBed.inject(HttpTestingController)
		snackBar = TestBed.inject(MatSnackBar)

		spyOn(snackBar, 'open').and.callFake(
			() =>
				({
					afterDismissed: () => ({ subscribe: () => {} }),
				}) as MatSnackBarRef<TextOnlySnackBar>,
		)

		fixture.detectChanges()
	})

	it('should create the component', () => {
		expect(component).toBeTruthy()
	})

	it('should reject invalid file type', () => {
		const input = document.createElement('input')

		Object.defineProperty(input, 'files', { value: [aviFile] })
		component.onFileSelected({ target: input } as unknown as Event)

		expect(component.selectedFile).toBeNull()
	})

	it('should reject file larger than 10MB', () => {
		const input = document.createElement('input')

		Object.defineProperty(input, 'files', { value: [largeFile] })
		component.onFileSelected({ target: input } as unknown as Event)

		expect(component.selectedFile).toBeNull()
	})

	it('should accept valid MP4 file', () => {
		const input = document.createElement('input')
		const mockFile = new File(['valid'], 'video.mp4', { type: 'video/mp4' })

		Object.defineProperty(input, 'files', { value: [mockFile] })
		component.onFileSelected({ target: input } as unknown as Event)

		expect(component.selectedFile).toEqual(mockFile)
	})

	it('should send file upload request and handle jobId', fakeAsync(() => {
		component.selectedFile = mp4File

		component.uploadFile()
		fixture.detectChanges()

		const req = httpMock.expectOne('/api/upload')
		expect(req.request.method).toBe('POST')
		req.flush({ jobId: '12345' })

		tick()
		expect(component.jobId).toBe('12345')
		flush()
	}))

	it('should handle upload error responses', fakeAsync(() => {
		component.selectedFile = mp4File

		component.uploadFile()
		fixture.detectChanges()

		const req = httpMock.expectOne('/api/upload')
		req.flush({ error: 'File too large' }, { status: 413, statusText: 'Payload Too Large' })

		tick()
		expect(component.loading).toBeFalse()
		expect(component.jobId).toBeNull()
		expect(snackBar.open).toHaveBeenCalled()
		flush()
	}))

	it('should listen to SSE job status updates', fakeAsync(() => {
		;(window as unknown as { EventSource: typeof MockEventSource }).EventSource = MockEventSource
		const eventSourceSpy = spyOn(window, 'EventSource').and.callThrough()

		component.jobId = '12345'
		component.sseJobStatus()
		fixture.detectChanges()

		// ✅ Ensure EventSource was created
		expect(eventSourceSpy).toHaveBeenCalledWith('/api/status/12345')

		// ✅ Trigger SSE completion event
		const eventSourceInstance = eventSourceSpy.calls.mostRecent().returnValue // as MockEventSource
		eventSourceInstance.onmessage?.({
			data: JSON.stringify({ status: 'completed', gifUrl: '/api/gif/12345.gif' }),
		} as MessageEvent)

		tick()
		fixture.detectChanges()

		// ✅ Assertions
		expect(component.gifUrl).toBe('/api/gif/12345.gif')
		expect(component.loading).toBeFalse()
		expect(eventSourceInstance.close).toHaveBeenCalled()
	}))
})
