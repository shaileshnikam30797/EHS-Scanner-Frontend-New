import { Component } from '@angular/core';
import { ScannerComponent } from './components/scanner/scanner.component';// Generate hone ke baad
import { ZXingScannerModule } from '@zxing/ngx-scanner'; 
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    ScannerComponent, // Import the generated scanner component
    ZXingScannerModule, 
    CommonModule
  ],
  template: `
    <main style="padding: 20px;">
      <h1>EHS Worker Check</h1>
      <app-scanner></app-scanner> </main>
  `,
  styleUrl: './app.component.css' // CSS file ka naam badla ja sakta hai
})
export class AppComponent {
  title = 'worker-scanner-app';
}