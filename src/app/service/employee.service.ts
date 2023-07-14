import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {

  private baseUrl = 'http://task.soft-zone.net/api/Employees'; // Base URL for API endpoint

  constructor(private http: HttpClient) {}

  // Get all employees
  getAllEmployees(): Observable<any> {
    return this.http.get(`${this.baseUrl}/getAllEmployees`);
  }

  // Get employee by ID
  getEmployeeById(empId: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/getEmpByID/${empId}`);
  }

  // Add new employee
  addEmployee(employeeData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/addEmployee`, employeeData);
  }

  // Edit existing employee
  editEmployee(employeeData: any): Observable<any> {
    const url = `${this.baseUrl}/editEmployee`;
    return this.http.put(url, employeeData);
  }

  // Delete employee by ID
  deleteEmployeeById(empId: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteEmpByID/${empId}`);
  }
}
