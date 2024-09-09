import { Component, Input } from '@angular/core';
import { SafeHtmlPipe } from '../../pipe/sanitize';

@Component({
  selector: 'app-display-qr-code',
  standalone: true,
  imports: [SafeHtmlPipe],
  templateUrl: './display-qr-code.component.html',
  styleUrl: './display-qr-code.component.scss'
})
export class DisplayQrCodeComponent {
  @Input('qrCode') qrCode: string = ""
}
