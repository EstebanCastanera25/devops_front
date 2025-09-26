
import { ChangeDetectionStrategy, Component, Inject} from '@angular/core';
import {  MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-dialog-animations',
  templateUrl: './dialog-animations.component.html',
  styleUrl: './dialog-animations.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogAnimationsComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogAnimationsComponent>,
    @Inject(MAT_DIALOG_DATA) public data?: { titulo?: string; contenido?: string }
  ) {}
}
