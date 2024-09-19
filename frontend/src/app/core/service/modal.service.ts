import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable } from '@angular/core';
import { ModalComponent } from '../component/modal/modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  modalCompRef: ComponentRef<ModalComponent> | undefined;

  constructor(
    private appRef: ApplicationRef,
    private injector: EnvironmentInjector
  ) { }

  createComponent(componentRef: ComponentRef<any>): ComponentRef<ModalComponent> {
    // Create the base modal component
    this.modalCompRef = createComponent(ModalComponent, {
      environmentInjector: this.injector, // Pass the injector to the component
    });

    // Create the embedded view of the component
    const modalEmbeddedView = this.modalCompRef.instance.modalContent.insert(componentRef.hostView);

    // Append the component to the body
    document.body.appendChild(this.modalCompRef.location.nativeElement);

    // Detect changes on the embedded view and the component
    modalEmbeddedView.detectChanges();
    this.modalCompRef.changeDetectorRef.detectChanges();

    // Attach the component to the application so it can be checked by angular
    this.appRef.attachView(this.modalCompRef.hostView);

    return this.modalCompRef;
  }

  open(ref: ComponentRef<any>): ComponentRef<ModalComponent> {
    return this.createComponent(ref);
  }

  close(): void {
    this.modalCompRef?.destroy();
    if (this.modalCompRef?.hostView) {
      this.appRef.detachView(this.modalCompRef?.hostView);
    }
  }
}
