import { Component } from '@angular/core'
import { UploadComponent } from '#client/components/upload/upload.component'

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	imports: [UploadComponent],
	standalone: true,
})
export class AppComponent {
	title = 'mp4-to-gif-client'
}
