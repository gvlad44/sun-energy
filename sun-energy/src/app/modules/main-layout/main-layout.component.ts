import { Component } from '@angular/core';
import { MenuItem } from 'src/app/interfaces/menu-item.interface';

@Component({
  selector: 'app-main-layout',
  templateUrl: './main-layout.component.html',
  styleUrls: ['./main-layout.component.scss'],
})
export class MainLayoutComponent {
  isExpanded: boolean = false;
  menuItems: MenuItem[] = [
    { routerLink: '/dashboard', icon: 'home', title: 'Dashboard' },
  ];

  triggerSidenavAction() {
    this.isExpanded = !this.isExpanded;
  }
}
