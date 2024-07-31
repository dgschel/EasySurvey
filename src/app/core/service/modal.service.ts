import { ApplicationRef, ComponentRef, createComponent, EnvironmentInjector, Injectable, TemplateRef } from '@angular/core';
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

  createComponent(content: TemplateRef<any>): ComponentRef<ModalComponent> {
    // Create an embedded view from the template
    const modalEmbeddedView = content.createEmbeddedView(null);

    // Create the base modal component
    this.modalCompRef = createComponent(ModalComponent, {
      environmentInjector: this.injector, // Pass the injector to the component
      projectableNodes: [modalEmbeddedView.rootNodes], // Pass the nodes to the component to inject the content inside of <ng-template>
    });

    // Append the component to the body
    document.body.appendChild(this.modalCompRef.location.nativeElement);

    // Detect changes on the embedded view and the component
    modalEmbeddedView.detectChanges();
    this.modalCompRef.changeDetectorRef.detectChanges();

    // Attach the component to the application so it can be checked by angular
    this.appRef.attachView(this.modalCompRef.hostView);

    return this.modalCompRef;
  }

  open(templateRef: TemplateRef<any>): ComponentRef<ModalComponent> {
    return this.createComponent(templateRef);
  }

  close(): void {
    this.modalCompRef?.destroy();
    if (this.modalCompRef?.hostView) {
      this.appRef.detachView(this.modalCompRef?.hostView);
    }
  }
}
