import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-copy-to-clipboard',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss'
})
export class CopyToClipboardComponent implements OnInit {
  @Input({ required: true }) textToCopy: string = '';
  private iconReg = inject(SvgIconRegistryService);
  private isCopySuccess = signal<boolean>(false);

  tooltipText = computed(() => this.isCopySuccess() ? 'Kopiert!' : 'Kopieren');

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/clipboard.svg', 'clipboard')?.subscribe();
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('clipboard');
  }

  copyToClipboard(): void {
    this.isCopySuccess.set(true);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(this.textToCopy).then(() => {
        setTimeout(() => this.isCopySuccess.set(false), 2000);
      });
    } else {
      // Clipboard API not available, fallback to document.execCommand('copy')
      const input = document.createElement('input');
      input.value = this.textToCopy;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setTimeout(() => this.isCopySuccess.set(false), 2000);
    }
  }
}