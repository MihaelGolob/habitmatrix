import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme-service';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { heroMoon, heroSun } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-header',
  imports: [NgIconComponent],
  providers: [provideIcons({heroMoon, heroSun})],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(public themeService:ThemeService) {}
}
