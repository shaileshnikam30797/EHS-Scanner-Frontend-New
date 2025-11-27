import { Component, OnInit } from '@angular/core';
import { WorkerDataService, WorkerData } from '../../services/worker-data.service';
import { BarcodeFormat } from '@zxing/library';
import { CommonModule } from '@angular/common';
import { ZXingScannerModule } from '@zxing/ngx-scanner'; // Zaroori ZXing import
import { FormsModule } from '@angular/forms'; 
import { HttpClientModule } from '@angular/common/http'; // <--- YE ZAROORI HAI!

@Component({
  selector: 'app-scanner',
  standalone: true,
  // Zaroori modules imports
  imports: [CommonModule, ZXingScannerModule, FormsModule, HttpClientModule], 
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.css'],
  providers: [WorkerDataService]
})
export class ScannerComponent implements OnInit {
  // --- Zxing Variables ---
  scannedResult: string | null = null;
  allowedFormats = [ BarcodeFormat.QR_CODE ];
  
  // --- Data & State ---
  workerData: WorkerData | null = null;
  isScanning: boolean = false;
  
  constructor(private workerDataService: WorkerDataService) { }

  ngOnInit(): void {
    //
  }

  startScan() {
    this.workerData = null; // Purana data clear karein
    this.isScanning = true;
    this.scannedResult = null;
    console.log("Scanning started...");
  }

  stopScan() {
    this.isScanning = false;
    console.log("Scanning stopped.");
  }

  handleScanSuccess(result: string) {
    if (result) {
      this.scannedResult = result;
      this.stopScan(); 
      this.fetchWorkerData(result); 
    }
  }

  // --- Data Fetching and Logic ---

  fetchWorkerData(workerId: string) {
    this.workerDataService.getWorkerData(workerId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.workerData = response.data;
          console.log('Worker Data Fetched:', this.workerData);
        } else {
          console.error('API Error: Worker Not Found', response.message);
          this.workerData = this.createErrorWorkerData(workerId, "Worker Not Found", "Expired");
        }
      },
      error: (err) => {
        // Agar server se connect nahi ho paya
        console.error('Server or API connection error:', err);
        // Browser Console mein aapko CORS ya Connection Refused error dikhega
        this.workerData = this.createErrorWorkerData(workerId, "SERVER OFFLINE / CONNECTION ERROR", "Expired");
      }
    });
  }

  private createErrorWorkerData(id: string, name: string, validity: 'Expired' | 'Valid' | 'Due'): WorkerData {
    // Dummy structure for display when error occurs
    return {
      Worker_ID: id,
      Name: name,
      Safety_Induction_Status: "Pending", 
      DOB: "N/A",
      Medical_Report_Link: "#",
      Medical_Test_Date: "N/A",
      Medical_Due_Date: "N/A",
      Medical_Validity: validity
    } as WorkerData;
  }

  // --- Status Logic ---
  
  getStatusClass(): string {
    if (!this.workerData) return 'bg-gray-400';
    return this.workerData.Medical_Validity === 'Valid' 
      ? 'bg-green-600 border-green-700 shadow-xl' 
      : 'bg-red-600 border-red-700 shadow-xl';
  }

  getStatusMessage(): string {
    if (!this.workerData) return 'Scanning...';
    
    if (this.workerData.Name === "SERVER OFFLINE / CONNECTION ERROR") {
        return 'SERVER OFFLINE';
    }

    if (this.workerData.Medical_Validity === 'Valid' && this.workerData.Safety_Induction_Status === 'Done') {
        return 'ACCESS GRANTED';
    } else if (this.workerData.Medical_Validity === 'Due') {
        return 'ACCESS DENIED (Medical Due - Recheck)';
    } else if (this.workerData.Medical_Validity === 'Expired') {
        return 'ACCESS DENIED (Medical Expired)';
    } else if (this.workerData.Safety_Induction_Status === 'Pending') {
        return 'ACCESS DENIED (Induction Pending)';
    } else {
        return 'ACCESS DENIED (Check Details)';
    }
  }
}