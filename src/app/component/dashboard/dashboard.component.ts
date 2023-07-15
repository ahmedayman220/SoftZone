import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import {EmployeeModel} from 'src/app/model/employee.model';
import {EmployeeService} from 'src/app/service/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})

export class DashboardComponent implements OnInit {
  // form Values
  formValue!: FormGroup; // FormGroup for managing form data

  // display status for button Add Or edit
  savingEmployee = false; // Flag to indicate if an employee is being saved
  editButton = true; // Flag to indicate if the edit button is displayed
  addButton = false; // Flag to indicate if the add button is displayed

  // Pagination
  page = 1; // Current page number
  count = 0; // Total count of employees
  tableSize = 10; // Number of employees per page
  tableSizes = [3, 6, 9, 12]; // Options for table size

  constructor(private formBuilder: FormBuilder, private api: EmployeeService) {
  }

  ngOnInit(): void {
    // get All data
    this.getAllEmployees();

    // validation & Initial Data
    this.formValue = this.formBuilder.group({
      empName: new FormControl('', [Validators.required]), // FormControl for employee name
      empEmail: new FormControl('', [Validators.required, Validators.email]), // FormControl for employee email
      empAddress: new FormControl('', [Validators.required]), // FormControl for employee address
      empPhone: new FormControl('', [Validators.required, Validators.pattern(/^(011|012|010)\d{8}$/)]) // FormControl for employee phone number
    });
  }

  // ===========================================================================
  // GET ALL EMPLOYEE
  // ===========================================================================

  employees: any[] = []; // Array to store the retrieved employee data

  getAllEmployees() {
    this.api.getAllEmployees().subscribe(
      (response) => {
        this.employees = response; // Assign the retrieved employees to the array
      },
      (error) => {
        console.error(error); // Handle error in retrieving employees
      }
    );
  }

  // ===========================================================================
  // ADD EMPLOYEE
  // ===========================================================================

  employeeModelObj: EmployeeModel[] = []; // Array to store employee data for posting

  postEmployee() {
    this.savingEmployee = true; // Set the flag to indicate saving employee

    this.employeeModelObj = this.formValue.value; // Get the employee data from the form
    console.log(this.employeeModelObj);

    this.api.addEmployee(this.employeeModelObj).subscribe(
      (response) => {
        document.getElementById('cancel')?.click(); // Trigger cancel button click event
        this.successMessage('Add'); // Display success message
        this.formValue.reset(); // Reset the form
        this.getAllEmployees(); // Retrieve all employees again
      },
      (err) => {
        alert('Something Went Wrong'); // Handle error in posting employee
      }
    );

    this.savingEmployee = false; // Reset the flag after saving employee
  }

  displayAddButton() {
    this.formValue.reset(); // Reset the form values
    this.addButton = true; // Show the add button
    this.editButton = false; // Hide the edit button
  }

  handleButtonClick() {
    if (this.editButton) {
      this.editEmployee(); // Call editEmployee function if editButton is true
    } else {
      this.postEmployee(); // Call postEmployee function if editButton is false
    }
  }
  // ===========================================================================
  // EDIT EMPLOYEE
  // ===========================================================================

  employeeData = {
    id: 0,
    empName: '',
    empEmail: '',
    empAddress: '',
    empPhone: ''
  };

  editFormValue(id: any) {
    this.addButton = false; // Hide the add button
    this.editButton = true; // Show the edit button

    this.api.getEmployeeById(id).subscribe(
      (res) => {
        this.employeeData = res; // Assign the retrieved employee data to the object
        this.formValue.patchValue(res); // Set the form values to the retrieved employee data
      },
      (err) => {
        console.log(err);
        alert('Something Went Wrong'); // Handle error in retrieving employee by ID
      }
    );
  }

  editEmployee() {
    this.savingEmployee = true; // Set the flag to indicate saving employee

    this.employeeData = {...this.employeeData, ...this.formValue.value}; // Update employeeData object with form values

    this.api.editEmployee(this.employeeData).subscribe(
      (response) => {
        document.getElementById('cancel')?.click(); // Trigger cancel button click event
        this.successMessage('Edit'); // Display success message
        this.formValue.reset(); // Reset the form
        this.getAllEmployees(); // Retrieve all employees again
      },
      (err) => {
        console.log(err);
        alert('Something Went Wrong'); // Handle error in editing employee
      }
    );

    this.savingEmployee = false; // Reset the flag after saving employee
  }

  // ===========================================================================
  // DELETE EMPLOYEE
  // ===========================================================================

  deleteEmployee(id: number) {
    this.api.deleteEmployeeById(id).subscribe(
      (res) => {
        document.getElementById(`e${id}`)?.click(); // Trigger cancel button click event
        this.successMessage('Delete'); // Display success message
        this.getAllEmployees(); // Retrieve all employees again
      },
      (err) => {
        console.log(err);
        alert(err); // Handle error in deleting employee
      }
    );
  }

  // ===========================================================================
  // DISPLAY ERROR BEFORE INPUT
  // ===========================================================================

  isFieldInvalid(field: string) {
    const control = this.formValue.get(field);
    return control !== null && control.touched && control.invalid; // Check if the form field is invalid
  }

  // ===========================================================================
  // DISPLAY SUCCESS AFTER DO ( ADD , EDIT , DELETE )
  // ===========================================================================

  display = false; // Flag to control the display of success message
  message = ''; // Success message

  successMessage(proccess: string) {
    this.display = true; // Show the success message
    if (proccess === 'Add') {
      this.message = 'Added'; // Set success message for adding employee
    } else if (proccess === 'Edit') {
      this.message = 'Edited'; // Set success message for editing employee
    } else {
      this.message = 'Deleted'; // Set success message for deleting employee
    }

    setTimeout(() => {
      this.display = false; // Hide the success message after 5 seconds
    }, 5000);
  }

  // ===========================================================================
  // PAGENATION
  // ===========================================================================

  onTableDataChange(event: any) {
    this.page = event; // Update the current page number
    this.getAllEmployees(); // Retrieve all employees again
  }

  onTableSizeChange(event: any): void {
    this.tableSize = event.target.value; // Update the number of employees per page
    this.page = 1; // Reset the current page number
    this.getAllEmployees(); // Retrieve all employees again
  }
}
