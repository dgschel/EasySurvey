import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, inject, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicOptionComponent } from '../../ui/dynamic-option/dynamic-option.component';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
})
export class FormSelectComponent implements AfterViewInit {
  private cdr = inject(ChangeDetectorRef);
  components: ComponentRef<DynamicOptionComponent>[] = [];

  // Callback function to update options passed down from parent to child
  @Input() optionsChangedCallback = (options: string[]): string[] => options;

  @ViewChild('host', { read: ViewContainerRef }) host!: ViewContainerRef;

  // Will be used to populate options
  get values() {
    return this.components.map(cmp => cmp.instance.value);
  }

  ngAfterViewInit(): void {
    this.addComponent();
  }

  addComponent() {
    const componentRef = this.host.createComponent(DynamicOptionComponent);
    this.components.push(componentRef);
    componentRef.instance.remove.subscribe(() => this.onRemove(componentRef));
    componentRef.changeDetectorRef.detectChanges();
    this.cdr.detectChanges();
    this.optionsChangedCallback(this.values);
  }

  onRemove(cmpRef: ComponentRef<DynamicOptionComponent>) {
    // Only remove if there is more than one component
    if (this.components.length === 1) return;

    const index = this.components.indexOf(cmpRef);
    if (index !== -1) {
      this.components.splice(index, 1);
      cmpRef.destroy();
      this.optionsChangedCallback(this.values);
    }
  }
}
