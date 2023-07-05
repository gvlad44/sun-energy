import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'src/app/interfaces/menu-item.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnInit {
  isExpanded: boolean = false;
  menuItems: MenuItem[] = [
    { routerLink: '/dashboard', icon: 'home', title: 'Dashboard' },
    { routerLink: '/bills', icon: 'payments', title: 'Bills' },
    {
      routerLink: '/future',
      icon: 'solar_power',
      title: 'Buy and sell energy',
    },
    {
      routerLink: '/data',
      icon: 'analytics',
      title: 'View company data',
    },
  ];
  user = '';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.user = localStorage.getItem('email')!;
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigateByUrl('/login');
      },
    });
  }

  triggerSidenavAction() {
    this.isExpanded = !this.isExpanded;
  }
}
