import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { AsyncPipe } from '@angular/common';

import {
  BehaviorSubject,
  combineLatest,
  finalize,
  fromEvent,
  interval,
  map,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs';

import { BasicCardComponent } from '../../../../shared/ui/basic-card/basic-card.component';
import { StripeConsentService } from '../../../../core/service/stripe-consent.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-stripe-consent',
  standalone: true,
  imports: [BasicCardComponent, AsyncPipe],
  templateUrl: './stripe-consent.component.html',
  styleUrl: './stripe-consent.component.scss',
})
export class StripeConsentComponent implements OnInit {
  private destroyRefService = inject(DestroyRef);
  private stripeConsentService = inject(StripeConsentService);

  @ViewChild('consentButton', { static: true }) consentButton!: ElementRef<HTMLButtonElement>;

  isButtonDisabled$ = new BehaviorSubject<boolean>(true);
  countdownValue$ = new BehaviorSubject<number>(3);

  buttonText: string = '';

  ngOnInit(): void {
    const button$ = fromEvent(this.consentButton.nativeElement, 'click').pipe(
      takeUntilDestroyed(this.destroyRefService),
      map(() => localStorage.setItem('stripeConsent', 'true')),
    );

    const countdown$ = interval(1000).pipe(
      take(3), // Countdown from 3 to 1
      map((value) => 3 - (value + 1)), // Reverse the countdown and incremunt by plus 1 since it start with 0
      tap((value) => this.countdownValue$.next(value)),
      finalize(() => this.isButtonDisabled$.next(false)),
      switchMap(() => button$), // switch to button click observable
      startWith(3), // start the first emission with initial value
    );

    combineLatest([countdown$, this.countdownValue$, this.isButtonDisabled$])
      .pipe(
        takeUntilDestroyed(this.destroyRefService),
        map(([_, countdownValue, isDisabled]) => (isDisabled ? `Zustimmung in ${countdownValue}` : 'Zustimmen')),
        tap((text) => (this.buttonText = text)),
      )
      .subscribe();
  }
}
