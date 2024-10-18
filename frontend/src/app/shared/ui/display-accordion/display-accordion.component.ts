import { Component, input } from '@angular/core';

@Component({
  selector: 'app-display-accordion',
  standalone: true,
  imports: [],
  templateUrl: './display-accordion.component.html',
  styleUrl: './display-accordion.component.scss',
})
export class DisplayAccordionComponent {
  accordions = input<{ title: string; content: string }[]>([]);
}
