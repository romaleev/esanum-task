import { TestBed } from '@angular/core/testing'
import { provideHttpClient } from '@angular/common/http'
import { provideAnimations } from '@angular/platform-browser/animations'
import { MatSnackBarModule } from '@angular/material/snack-bar'
import { provideRouter } from '@angular/router'
import { AppComponent } from './app.component'
import { UploadComponent } from '#client/components/upload/upload.component'
import { importProvidersFrom } from '@angular/core'

describe('AppComponent', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [AppComponent, UploadComponent],
			providers: [
				provideRouter([]),
				provideHttpClient(),
				provideAnimations(),
				importProvidersFrom(MatSnackBarModule),
			],
		}),
	)

	it('should create the app', () => {
		const fixture = TestBed.createComponent(AppComponent)
		const app = fixture.componentInstance
		expect(app).toBeTruthy()
	})

	it(`should have as title 'mp4-to-gif-client'`, () => {
		const fixture = TestBed.createComponent(AppComponent)
		const app = fixture.componentInstance
		expect(app.title).toEqual('mp4-to-gif-client')
	})

	it('should render title', () => {
		const fixture = TestBed.createComponent(AppComponent)
		fixture.detectChanges()
		const compiled = fixture.nativeElement as HTMLElement
		expect(compiled.querySelector('h1')?.textContent).toContain('MP4 to GIF Converter')
	})
})
