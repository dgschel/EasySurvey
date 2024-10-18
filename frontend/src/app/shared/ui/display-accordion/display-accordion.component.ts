import { Component, input } from '@angular/core';

type AccordionItem = {
  title: string;
  content: string;
};

@Component({
  selector: 'app-display-accordion',
  standalone: true,
  imports: [],
  templateUrl: './display-accordion.component.html',
  styleUrl: './display-accordion.component.scss',
})
export class DisplayAccordionComponent {
  accordions = input<AccordionItem[]>([]);
}
