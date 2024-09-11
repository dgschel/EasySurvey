import { AfterViewInit, Component, ElementRef, EventEmitter, ViewChild, ViewContainerRef, Input } from '@angular/core';
import { fromEvent } from 'rxjs';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss'
})
export class ModalComponent implements AfterViewInit {
  @Input("isBackdropClosable") isBackdropClosable = true;
  @ViewChild('modal') modal!: ElementRef<HTMLDialogElement>;
  @ViewChild('modalContent', { read: ViewContainerRef, static: true }) modalContent!: ViewContainerRef;

  modalCloseEvent = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.modal.nativeElement.showModal();

    // Listen to the close event of the dialog element
    // Either the user clicks on the close button or the user clicks outside of the dialog
    fromEvent(this.modal.nativeElement, 'close').subscribe(() => this.modalCloseEvent.emit());
  }
}
