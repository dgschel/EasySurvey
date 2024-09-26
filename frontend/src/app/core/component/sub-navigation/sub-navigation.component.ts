import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';

import { SubNavigationService } from '../../service/sub-navigation.service';

@Component({
  selector: 'app-sub-navigation',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './sub-navigation.component.html',
  styleUrl: './sub-navigation.component.scss'
})
export class SubNavigationComponent {
  protected subNavService = inject(SubNavigationService);
}
