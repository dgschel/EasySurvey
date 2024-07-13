import { Component } from '@angular/core';

@Component({
  selector: 'app-create-component',
  standalone: true,
  imports: [],
  templateUrl: './create-component.component.html',
  styleUrl: './create-component.component.scss'
})
export class CreateComponentComponent {
  trackChange(controlType: string) {
    console.log(`Control type changed to ${controlType}`);
  }
}
