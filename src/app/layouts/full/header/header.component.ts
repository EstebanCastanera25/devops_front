import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  HostListener,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  /** Mostrar/ocultar el botón segun tu lógica actual */
  @Input() showToggle = true;
  @Input() toggleChecked = false;

  /** Estado opcional para cambiar iconos según colapso y tamaño */
  @Input() isCollapsed = false;
  @Input() isMobile = false;

  /** Eventos (compat + claro para el contenedor) */
  @Output() toggleSidebar = new EventEmitter<void>();        // 👉 NUEVO: usar este
  @Output() toggleMobileNav = new EventEmitter<void>();      // compat si lo usás
  @Output() toggleMobileFilterNav = new EventEmitter<void>(); // compat
  @Output() toggleCollapsed = new EventEmitter<void>();      // compat

  showFiller = false;

  constructor(public dialog: MatDialog, private _router: Router) {}

  logout(): void {
    this.clearSession();
    this._router.navigate(['login']);
  }

  /** 🔹 Limpieza de sesión */
  private clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('_id');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('_id');
  }

  /** Emitimos todos los toggles relevantes (el contenedor puede enganchar el que prefiera) */
  onToggleClick(): void {
    this.toggleSidebar.emit();   // 👉 el que debe usar el FullComponent
    this.toggleCollapsed.emit(); // compat
    // si todavía usabas toggleMobileNav en alguna vista, lo dejamos:
    if (this.isMobile) this.toggleMobileNav.emit();
  }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(_: BeforeUnloadEvent) {
    this.clearSession();
  }
}