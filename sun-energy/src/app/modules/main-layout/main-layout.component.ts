import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { MenuItem } from 'src/app/interfaces/menu-item.interface';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent implements OnDestroy {
  isExpanded: boolean = false;
  menuItems: MenuItem[] = [
    { routerLink: '/dashboard', icon: 'home', title: 'Dashboard' },
  ];
  logoutSubscription: Subscription = Subscription.EMPTY;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    this.logoutSubscription.unsubscribe();
  }

  logout() {
    this.logoutSubscription = this.authService.logout().subscribe({
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
