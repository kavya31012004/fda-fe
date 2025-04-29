import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
 
@Component({
  standalone: true,
  selector: 'app-popup-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <mat-icon color="warn" class="dialog-icon">error_outline</mat-icon>
        <h2 class="dialog-title">{{ data.title }}</h2>
      </div>
      <div class="dialog-message">
        {{ data.message }}
      </div>
      <div class="dialog-actions">
        <button mat-flat-button color="primary" mat-dialog-close>OK</button>
      </div>
    </div>
  `,
  styles: [`
    .dialog-container {
      padding: 24px;
      max-width: 400px;
    }
 
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 16px;
    }
 
    .dialog-icon {
      font-size: 26px;
      vertical-align: middle;
      margin-top: -4px;
    }
 
    .dialog-title {
      margin: 0;
      font-size: 22px;
      font-weight: 600;
      margin:0;
      line-height:1.2;
    }
 
    .dialog-message {
      font-size: 16px;
      color: #444;
      margin-bottom: 24px;
    }
 
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
    }
  `],
  imports: [MatDialogModule, MatButtonModule, MatIconModule, CommonModule]
})
export class PopupDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }) {}
}