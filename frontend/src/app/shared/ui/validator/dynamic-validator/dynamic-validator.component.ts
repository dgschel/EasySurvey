import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-dynamic-validator',
  standalone: true,
  imports: [],
  templateUrl: './dynamic-validator.component.html',
  styleUrl: './dynamic-validator.component.scss'
})
export class DynamicValidatorComponent {
  @Input() validators: string[] = [];
}
