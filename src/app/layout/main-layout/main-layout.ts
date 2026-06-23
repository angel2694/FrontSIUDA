import { Component, signal } from '@angular/core';
import { Navbar } from "../../shared/navbar/navbar";
import { Sidebar } from "../../shared/sidebar/sidebar";
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  imports: [Navbar, Sidebar, RouterOutlet, CommonModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayout {
  navigating = signal(false);

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.navigating.set(true);
      }
      if (event instanceof NavigationEnd ||
          event instanceof NavigationCancel ||
          event instanceof NavigationError) {
        setTimeout(() => this.navigating.set(false), 600);
      }
    });
  }
}
