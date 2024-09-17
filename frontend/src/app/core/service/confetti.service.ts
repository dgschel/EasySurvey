import { Injectable } from '@angular/core';

import * as confetti from 'canvas-confetti';

@Injectable({
  providedIn: 'root'
})
export class ConfettiService {
  celebrate(canvas: HTMLCanvasElement, option: confetti.Options = {}) {
    return confetti.create(canvas)(option)
  }
}