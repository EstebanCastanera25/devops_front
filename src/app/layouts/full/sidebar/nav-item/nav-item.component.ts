import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavItem } from '../nav-item/nav-item'; // ajustá la ruta si difiere

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.component.html',
  styleUrls: ['./nav-item.component.scss']
})
export class NavItemComponent implements OnInit {
  @Input() item!: NavItem;
  @Input() collapsed = false;

  expanded = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Si alguna ruta hija está activa, arrancar expandido
    if (this.item?.children?.length) {
      this.expanded = this.item.children.some((c:any) => {
        const r = c.route ?? '';
        return r ? this.router.isActive(r, false) : false;
      });
    }
  }

  toggleGroup(): void {
    this.expanded = !this.expanded;
  }
}