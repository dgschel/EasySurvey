import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

interface SubNavigationConfig {
  show: boolean;
  tabs: Array<{ label: string, route: string }>;
}

@Injectable({
  providedIn: 'root'
})
export class SubNavigationService {
  private subNavConfigSubject = new BehaviorSubject<SubNavigationConfig>({
    show: false,
    tabs: []
  });

  subNavConfig$ = this.subNavConfigSubject.asObservable();

  updateSubNavConfig(config: SubNavigationConfig) {
    this.subNavConfigSubject.next(config);
  }

  clearSubNavConfig() {
    this.subNavConfigSubject.next({ show: false, tabs: [] });
  }
}
