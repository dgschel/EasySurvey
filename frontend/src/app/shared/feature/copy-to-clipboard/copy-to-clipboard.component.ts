import { Component, inject, Input, OnInit } from '@angular/core';
import { SvgIconComponent, SvgIconRegistryService } from 'angular-svg-icon';

@Component({
  selector: 'app-copy-to-clipboard',
  standalone: true,
  imports: [SvgIconComponent],
  templateUrl: './copy-to-clipboard.component.html',
  styleUrl: './copy-to-clipboard.component.scss'
})
export class CopyToClipboardComponent implements OnInit {
  private iconReg = inject(SvgIconRegistryService);

  @Input({ required: true }) textToCopy: string = '';

  ngOnInit(): void {
    this.iconReg.loadSvg('/svg/clipboard.svg', 'clipboard')?.subscribe();
  }

  ngOnDestroy(): void {
    this.iconReg.unloadSvg('clipboard');
  }
}
