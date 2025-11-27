import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// Corrected interface 'WorkerData' for type safety
export interface WorkerData {
  Worker_ID: string;
  Name: string;
  Safety_Induction_Status: 'Done' | 'Pending'; 
  DOB: string;
  Medical_Report_Link: string;
  // Medical Validation fields
  Medical_Test_Date: string;
  Medical_Due_Date: string;
  Medical_Validity: 'Valid' | 'Expired' | 'Due'; // Status ke teen options
}

export interface ApiResponse {
  success: boolean;
  data?: WorkerData;
  message?: string;
}

@Injectable({
  providedIn: 'root'
})
export class WorkerDataService {
  private apiUrl = 'http://localhost:3000/api/worker';

  constructor(private http: HttpClient) { }

  getWorkerData(workerId: string): Observable<ApiResponse> {
    const url = `${this.apiUrl}/${workerId}`;
    return this.http.get<ApiResponse>(url);
  }
}