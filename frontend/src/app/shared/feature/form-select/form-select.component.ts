import { AfterViewInit, ChangeDetectorRef, Component, ComponentRef, inject, Input, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicOptionComponent } from '../../ui/dynamic-option/dynamic-option.component';

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [],
  templateUrl: './form-select.component.html',
  styleUrl: './form-select.component.scss',
})
export class FormSelectComponent implements AfterViewInit, OnDestroy {
  private cdr = inject(ChangeDetectorRef);
  components: ComponentRef<DynamicOptionComponent>[] = [];

  // Callback function to update options passed down from parent to child
  @Input() optionsChangedCallback = (options: string[]): string[] => options;
  @Input() options: string[] = []

  @ViewChild('host', { read: ViewContainerRef }) host!: ViewContainerRef;

  // Will be used to populate options
  get values() {
    return this.components
      .filter(cmp => cmp.instance.value !== '')
      .map(cmp => cmp.instance.value);
  }

  ngAfterViewInit(): void {
    if (this.options.length === 0) this.createOption();
    else this.options.forEach(option => this.createOption(option));
  }

  createOption(value = '') {
    const componentRef = this.host.createComponent(DynamicOptionComponent);
    componentRef.setInput('value', value);
    this.components.push(componentRef);
    this.setupListeners(componentRef);
    this.setupIndex();
    componentRef.changeDetectorRef.detectChanges();
    this.cdr.detectChanges();
  }

  setupIndex() {
    this.components.forEach((cmp, index) => {
      cmp.setInput('index', index);
    });
  }

  setupListeners(componentRef: ComponentRef<DynamicOptionComponent>) {
    componentRef.instance.remove.subscribe(() => this.onRemove(componentRef));
    componentRef.instance.blur.subscribe((index) => {
      this.handleLastOptionInput(index);
      this.optionsChangedCallback(this.values);
    });
  }

  handleLastOptionInput(index: number) {
    const lastComponent = this.components[this.components.length - 1];
    if (this.components.length - 1 === index && lastComponent.instance.value !== '') {
      this.createOption();
    }
  }

  onRemove(cmpRef: ComponentRef<DynamicOptionComponent>) {
    // Only remove if there is more than one component
    if (this.components.length === 1) return;

    const index = this.components.indexOf(cmpRef);

    if (index === -1) return;

    this.components.splice(index, 1);
    cmpRef.destroy();
    this.optionsChangedCallback(this.values);
    this.setupIndex();
  }

  ngOnDestroy(): void {
    this.components.forEach(cmp => cmp.destroy())
  }
}