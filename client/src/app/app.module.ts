import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { AppComponent } from './app.component'
import { UploadComponent } from './components/upload/upload.component'
import { HttpClientModule } from '@angular/common/http'
import { MatCardModule } from '@angular/material/card'
import { MatButtonModule } from '@angular/material/button'
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'
import { MatSnackBarModule } from '@angular/material/snack-bar'

@NgModule({
	declarations: [AppComponent, UploadComponent],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		MatCardModule,
		MatButtonModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
	],
	providers: [],
	bootstrap: [AppComponent],
})
export class AppModule {}
