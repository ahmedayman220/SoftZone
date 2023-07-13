import { EmployeeService } from 'src/app/service/employee.service';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { OnInit } from '@angular/core';
import { EmployeeModel } from 'src/app/model/employee.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  
  // form Values
  formValue !: FormGroup;

  // display status for button Add Or edit
  savingEmployee = false;
  editButton: boolean = true;
  addButton: boolean = false;

  // Pagination
  page: number = 1;
  count: number = 0;
  tableSize: number = 10;
  tableSizes: any = [3, 6, 9, 12];

  
  constructor(private formBuilder: FormBuilder, private api: EmployeeService) { };

  // ===========================================================================
  // Start Page
  // ===========================================================================

  ngOnInit(): void {
    // get All data
    this.getAllEmployees();

    // validation & Inetial Data
    this.formValue = this.formBuilder.group({
      "empName": new FormControl('', [Validators.required]),
      "empEmail": new FormControl('', [Validators.required, Validators.email]),
      "empAddress": new FormControl('', [Validators.required]),
      "empPhone": new FormControl('', [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]),
    })
  }

  // ===========================================================================
  // Push Employee Data from function getAllEmployees()
  // ===========================================================================

  employees: any[] = [];

  getAllEmployees() {
    this.api.getAllEmployees().subscribe(
      (response) => {
        this.employees = response;
      },
      (error) => {
        console.error(error);
      }
    );
  }


  // ===========================================================================
  // Post Employee
  // ===========================================================================

  employeeModelObj: EmployeeModel[] = [];
  postEmployee() {
    this.savingEmployee = true;
    this.employeeModelObj = this.formValue.value
    console.log(this.employeeModelObj);
    this.api.addEmployee(this.employeeModelObj)
      .subscribe(
        response => {

          document.getElementById('cancel')?.click();
          this.successMessage('Add');
          this.formValue.reset();
          this.getAllEmployees()

        },
        err => {
          alert('Somthing Went Wrong');
        }
      )
    this.savingEmployee = false;
  }


  // ===========================================================================
  // Display button Add
  // ===========================================================================

  displayAddButton() {
    this.formValue.reset()
    this.addButton = true;
    this.editButton = false;
  }

  handleButtonClick() {
    if (this.editButton) {
      this.editEmployee();
    } else {
      this.postEmployee();
    }
  }

  // ===========================================================================
  // Make the value for input have valus of employee that i want to edit it
  // ===========================================================================

  employeeData = {
    id: 0,
    empName: '',
    empEmail: '',
    empAddress: '',
    empPhone: ''
  };

  editFormValue(id: any) {

    this.addButton = false;
    this.editButton = true;

    this.api.getEmployeeById(id).subscribe(
      res => {
        this.employeeData = res;
        this.formValue.patchValue(res);
      }, err => {
        console.log(err)
        alert('Somthing Went Wrong');
      }
    )
  }

  editEmployee() {
    this.savingEmployee = true;
    this.employeeData = { ...this.employeeData, ...this.formValue.value }
    this.api.editEmployee(this.employeeData)
      .subscribe(
        response => {
          document.getElementById('cancel')?.click();
          this.successMessage('edit');
          this.formValue.reset();
          this.getAllEmployees()
        },
        err => {
          console.log(err)
          alert('Somthing Went Wrong');
        }
      )

    this.savingEmployee = false;
  }


  // ===========================================================================
  // Delete Employee
  // ===========================================================================
  deleteEmployee(id: number) {
    console.log('test')
    this.api.deleteEmployeeById(id).subscribe(
      res => {
        console.log("success")
        this.successMessage('delete');
      }, err => {
        console.log(err)
        alert(err);
      }
    )
  }

  // ===========================================================================
  // Display The Error Under Input
  // ===========================================================================
  isFieldInvalid(field: string) {
    const control = this.formValue.get(field);
    return control !== null && control.touched && control.invalid;
  }


  // ===========================================================================
  // Display Success Massege For Adding Employee
  // ===========================================================================

  display = false;
  message = '';
  successMessage(proccess: string) {
    this.display = true;
    if (proccess == 'Add') {
      this.message = 'Added'
    } else if ('Edit') {
      this.message = 'Edited'
    } else {
      this.message = 'Deleted'
    }
    setTimeout(() => {
      this.display = false;
    }, 5000);
  }

  // ===========================================================================
  // Pagination
  // ===========================================================================

  onTableDataChange(event: any) {
    this.page = event;
    this.getAllEmployees();
  }
  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value;
    this.page = 1;
    this.getAllEmployees();
  }


}


