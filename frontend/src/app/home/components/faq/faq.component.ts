import { Component, inject } from '@angular/core';

import {
  AccordionItem,
  DisplayAccordionComponent,
} from '../../../shared/ui/display-accordion/display-accordion.component';
import { FaqService } from '../../../core/service/faq.service';

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [DisplayAccordionComponent],
  templateUrl: './faq.component.html',
  styleUrl: './faq.component.scss',
})
export class FaqComponent {
  faqService = inject(FaqService);

  faqs: AccordionItem[] = [];

  ngOnInit() {
    this.faqService.getFaqData().subscribe((data) => (this.faqs = data));
  }
}
