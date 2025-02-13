import { ComponentFixture, TestBed, fakeAsync, tick, flush } from '@angular/core/testing'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'
import { MatSnackBar } from '@angular/material/snack-bar'
import { importProvidersFrom, NO_ERRORS_SCHEMA } from '@angular/core'
import { provideAnimations } from '@angular/platform-browser/animations'
import { provideHttpClient } from '@angular/common/http'
import { provideRouter } from '@angular/router'

import { UploadComponent } from './upload.component'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'

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

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			imports: [UploadComponent, MatSnackBarModule],
			providers: [
				{ provide: MatSnackBar, useValue: jasmine.createSpyObj('MatSnackBar', ['open']) },
				provideHttpClient(),
				provideHttpClientTesting(),
				provideAnimations(),
				provideRouter([]),
				importProvidersFrom(
					MatSnackBarModule,
					MatProgressSpinnerModule,
					MatCardModule,
					MatButtonModule,
				),
			],
			schemas: [NO_ERRORS_SCHEMA],
			teardown: { destroyAfterEach: false },
		}).compileComponents()

		fixture = TestBed.createComponent(UploadComponent)
		component = fixture.componentInstance
		httpMock = TestBed.inject(HttpTestingController)

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
