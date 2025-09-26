import { BreakpointObserver } from '@angular/cdk/layout';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';

const MOBILE_VIEW  = 'screen and (max-width: 768px)';
const TABLET_VIEW  = 'screen and (min-width: 769px) and (max-width: 1024px)';
const MONITOR_VIEW = 'screen and (min-width: 1025px)';

@Component({
  selector: 'app-full',
  templateUrl: './full.component.html',
  styleUrls: ['./full.component.scss']
})
export class FullComponent implements OnInit, OnDestroy {
  isCollapsed = false;
  isMobile   = false;

  private destroy$ = new Subject<void>();

  constructor(private bp: BreakpointObserver) {}

  ngOnInit(): void {
    this.bp
      .observe([MOBILE_VIEW, TABLET_VIEW, MONITOR_VIEW])
      .pipe(takeUntil(this.destroy$))
      .subscribe(state => {
        this.isMobile = !!state.breakpoints[MOBILE_VIEW];

        // en móvil el sidebar vive off-canvas ⇒ forzamos colapsado
        if (this.isMobile && !this.isCollapsed) this.isCollapsed = true;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // llamado desde el header
  toggleSidebarFromHeader(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}