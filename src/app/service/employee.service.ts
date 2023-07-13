import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class EmployeeService {
  
  private baseUrl = 'http://task.soft-zone.net/api/Employees';
  
  constructor(private http: HttpClient) {}

  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllEmployees`);
  }

  getEmployeeById(empId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getEmpByID/${empId}`);
  }

  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addEmployee`, employeeData);
  }

  editEmployee(employeeData: any): Observable<any> {
    const url = `${this.baseUrl}/editEmployee`;
    return this.http.put(url, employeeData);
  }

  deleteEmployeeById(empId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteEmpByID/${empId}`);
  }

}
