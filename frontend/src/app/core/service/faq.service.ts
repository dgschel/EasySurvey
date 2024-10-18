import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { AccordionItem } from '../../shared/ui/display-accordion/display-accordion.component';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FaqService {
  private faqUrl = 'data/faq-data.json';
  private http = inject(HttpClient);

  getFaqData(): Observable<AccordionItem[]> {
    return this.http.get<AccordionItem[]>(this.faqUrl);
  }
}
