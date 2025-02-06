import { TestBed } from '@angular/core/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { AppComponent } from './app.component'
import { UploadComponent } from './components/upload/upload.component'
import { HttpClientModule } from '@angular/common/http'
import { MatCardModule } from '@angular/material/card'
import { MatSnackBarModule } from '@angular/material/snack-bar'

describe('AppComponent', () => {
	beforeEach(() =>
		TestBed.configureTestingModule({
			imports: [RouterTestingModule, HttpClientModule, MatSnackBarModule, MatCardModule],
			declarations: [AppComponent, UploadComponent],
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
