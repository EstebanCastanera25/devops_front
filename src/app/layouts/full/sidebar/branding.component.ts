import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-branding',
  template: `
    <div class="brand">
      
      <span class="title" [style.color]="brandColor" *ngIf="!isCollapsed">Devops Admin</span>
    </div>
  `,
  styleUrls: ['./branding.component.scss']
})
export class BrandingComponent {
  brandColor = '#7a2793';
  @Input() isCollapsed = false;
}