import { Component, computed, inject, Input, OnInit, signal } from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';
import { Clipboard } from '@angular/cdk/clipboard';

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
  private clipboard = inject(Clipboard);
  private isCopySuccess = signal<boolean>(false);

  tooltipText = computed(() => this.isCopySuccess() ? 'Kopiert!' : 'In die Zwischenablage kopieren');

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/clipboard.svg', 'clipboard')?.subscribe();
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('clipboard');
  }

  copyToClipboard(): void {
    this.isCopySuccess.set(this.clipboard.copy(this.textToCopy));
    setTimeout(() => this.isCopySuccess.set(false), 2000);
  }
}