import { Component } from '@angular/core';
import { SubNavigationComponent } from "../sub-navigation/sub-navigation.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SubNavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
