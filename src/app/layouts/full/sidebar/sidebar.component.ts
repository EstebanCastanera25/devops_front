import { Component, EventEmitter, HostListener, Input, OnInit, Output } from '@angular/core';
import { NavItem } from './nav-item/nav-item';
import { navItems as RAW } from './sidebar-data';
import { AdminService } from '../../../services/admin.service'; // ⬅️ importa tu servicio

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  @Input()  isCollapsed = false;
  @Output() isCollapsedChange = new EventEmitter<boolean>();

  isMobile = false;
  navItems: NavItem[] = []; // ⬅️ ya no en crudo

  constructor(private admin: AdminService) {} // ⬅️ inyecta servicio

  ngOnInit(){
    this.onResize();
    const myRoles = this.admin.getRoles();             // ['admin', 'colaborador', ...]
    this.navItems = this.filterTree(RAW, myRoles);     // ⬅️ aplica filtro
  }

  /** Filtra grupos y hojas por rolesAny (ANY-of) */
  private filterTree(items: NavItem[], roles: string[]): NavItem[] {
    const canSee = (it: NavItem) => {
      const required = it.rolesAny ?? [];
      if (required.length === 0) return true;              // sin restricción
      return required.some(r => roles.includes(r));        // visible si tiene al menos uno
    };

    const out: NavItem[] = [];
    for (const it of items) {
      const children = it.children ? this.filterTree(it.children, roles) : [];

      if (children.length) {
        // grupo: se muestra si queda al menos 1 hijo visible
        out.push({ ...it, children });
      } else if (!it.children || it.children.length === 0) {
        // hoja: solo si pasa autorización
        if (canSee(it)) out.push({ ...it });
      }
    }
    return out;
  }

  @HostListener('window:resize') onResize(){
    this.isMobile = window.innerWidth < 960;
    if (this.isMobile) { this.isCollapsed = true; this.isCollapsedChange.emit(true); }
  }
  toggleSidebar(){ this.isCollapsed = !this.isCollapsed; this.isCollapsedChange.emit(this.isCollapsed); }
  closeOnBackdrop(){ if (this.isMobile && !this.isCollapsed) { this.isCollapsed = true; this.isCollapsedChange.emit(true); } }
  trackByName = (_: number, it: NavItem) => it.displayName;
}