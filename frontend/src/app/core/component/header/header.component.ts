import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SubNavigationComponent } from "../sub-navigation/sub-navigation.component";

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, SubNavigationComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

}
