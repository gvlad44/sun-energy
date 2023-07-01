import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/interfaces/menu-item.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isExpanded: boolean = false;
  menuItems: MenuItem[] = [
    { routerLink: '/dashboard', icon: 'home', title: 'Dashboard' },
    { routerLink: '/dashboard', icon: 'payments', title: 'Bills' },
    {
      routerLink: '/dashboard',
      icon: 'solar_power',
      title: 'Secure/sell your energy',
    },
  ];

  constructor(private authService: AuthService, private router: Router) {}

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
      error: () => {},
    });
  }

  triggerSidenavAction() {
    this.isExpanded = !this.isExpanded;
  }
}
