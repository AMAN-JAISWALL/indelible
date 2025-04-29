
import { TablerIconsModule } from 'angular-tabler-icons';
import { MaterialModule } from 'src/app/material.module';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { BrandingComponent } from '../sidebar/branding.component';

import { Component, OnInit, Output, EventEmitter, Input, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from './nav-item';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, NgScrollbarModule, TablerIconsModule, MaterialModule, BrandingComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HeaderComponent implements OnInit {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();
  showFiller = false;

  navItems: NavItem[] = [
    { displayName: 'Dashboard', iconName: 'layout-grid-add', route: '/dashboard' },
    { displayName: 'vaucher', iconName: 'package', route: '/extra/vaucher' },
    // { displayName: 'Booking', iconName: 'layout-grid-add', route: '/booking' },
    // { displayName: 'Tracking', iconName: 'layout-grid-add', route: '/tracking' },
    // { displayName: 'Voucher', iconName: 'layout-grid-add', route: '/voucher' }
  ];

  constructor(private router: Router, ) {}

  ngOnInit(): void {
    this.setActiveItem();
    this.router.events.subscribe(() => {
      this.setActiveItem();
    });
  }

  onItemSelected(item: NavItem): void {
    if (item.route) {
      this.router.navigate([item.route]); // Use the item.route dynamically
      console.log('Navigating to:', item.route);
    }
    console.log("runnning")

  }


  

  isActive(item: NavItem): boolean {
    return this.router.url === item.route;
  }

  private setActiveItem(): void {
    const activeRoute = this.router.url;
    const activeItem = this.navItems.find(item => item.route === activeRoute);
    if (activeItem) {
      // this.onItemSelected(activeItem);
    }
  }
}
