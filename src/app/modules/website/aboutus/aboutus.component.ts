import { Component, inject, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { passwordMatchValidator } from 'src/app/_customValidation/password-match.validator';
import { UsermanagementService } from 'src/app/_servies/usermanagement/usermanagement.service';
@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.scss'
})
export class AboutusComponent {
  private modalService = inject(NgbModal);
  private _toastr = inject(ToastrService)
  private _usermanagementService = inject(UsermanagementService)
  private _router = inject(Router);

  //global var
  localData: any = {};
  search_user_list: string = '';
  limit_user_list: any = 10;
  totalRecords: any = 0;
  totalPages: any;
  pages: number[] = [];
  currentPage: number = 1;
  isLoading: boolean = true;  //for_shimmer_effect
  getUsersData: any[] = [];

  // forms
  userForm: FormGroup = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required,]),
    email: new FormControl('', [Validators.required, Validators.email]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^\+351\s\d{3}\s\d{3}\s\d{3}$/),]),
    password: new FormControl('', [Validators.required]),
    password_confirmation : new FormControl('', [Validators.required]),
    userid: new FormControl(''),
    role: new FormControl('', [Validators.required]),
  },{validators: passwordMatchValidator });

  searchForm: FormGroup = new FormGroup({
    searchData: new FormControl('', [Validators.maxLength(200)]),
  })
  getRole: any;

  constructor() { }

  ngOnInit() {

    //start localStorage code
    const storedObj = localStorage.getItem('userDetails');
    if (storedObj) {
      const localUserDetails = JSON.parse(storedObj);
      this.localData = localUserDetails;
    } else {
      this._router.navigate(['/auth/signin'])
    }
    //end localStorage code

    const data = {
      "limit": +this.limit_user_list,
      "search": this.search_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    }
    this.getUsersFun(data)
    this.setupSearchSubscription(); //here searching functionality implemented
    this.getRoles();
  }

  async getRoles() {
    try {
      const res = await this._usermanagementService.getRole().toPromise();
      if (res) {
        this.getRole = res.data;
      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  async getUsersFun(data: any) {
    this.isLoading = true;
    try {
      const res = await this._usermanagementService.getUsers(data).toPromise();
      if (res) {
        this.getUsersData = res.data;
        // console.log("getUsersData>>", this.getUsersData);
        this.totalRecords = res.usercount;
        this.totalPages = Math.ceil(this.totalRecords / this.limit_user_list);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePages();
        this.isLoading = false;
      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
        this.isLoading = false;
      }
    } catch (err) {
      console.error("Error:", err);
      this.isLoading = false;
    }
  }

  setupSearchSubscription() {
    // Initialize form
    this.searchForm = new FormGroup({
      searchData: new FormControl('', [Validators.maxLength(200)]) // Initial value set to an empty string
    });
    // Listen for input changes to trigger search API
    this.searchForm.get('searchData')?.valueChanges.subscribe(value => {
      this.search_user_list = value;
      const data = {
        "limit": +this.limit_user_list,
        "search": this.search_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getUsersFun(data);
    });
  }


  onLimitChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.limit_user_list = selectedValue;
      this.currentPage = 1;
      const data = {
        "limit": +this.limit_user_list,
        "search": this.search_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getUsersFun(data);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const data = {
        "limit": +this.limit_user_list,
        "search": this.search_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getUsersFun(data);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    const data = {
      "limit": +this.limit_user_list,
      "search": this.search_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getUsersFun(data);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const data = {
        "limit": +this.limit_user_list,
        "search": this.search_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getUsersFun(data);
    }
  }

  updatePages() {
    const maxPagesToShow = 5; // Number of pages to show before and after current page
    const startPage = Math.max(1, this.currentPage - maxPagesToShow);
    const endPage = Math.min(this.totalPages, this.currentPage + maxPagesToShow);
    this.pages = [];
    // Add pages in the range of startPage to endPage
    for (let i = startPage; i <= endPage; i++) {
      this.pages.push(i);
    }
    // Ensure last 5 pages are always shown if near the end
    if (this.totalPages - this.currentPage <= maxPagesToShow) {
      this.pages = [];
      for (let i = Math.max(1, this.totalPages - maxPagesToShow * 2); i <= this.totalPages; i++) {
        this.pages.push(i);
      }
    }

    // Ensure first 5 pages are always shown if near the beginning
    if (this.currentPage <= maxPagesToShow) {
      this.pages = [];
      for (let i = 1; i <= Math.min(this.totalPages, maxPagesToShow * 2); i++) {
        this.pages.push(i);
      }
    }
  }


  handleAddUser(adduser: TemplateRef<any>) {
    this.userBoxHeading = 'Add';
    // Reset the form and enable all fields
    this.userForm.reset();
    this.userForm.get('email')?.enable();
    this.userForm.get('password')?.enable();
    this.modalService.open(adduser, { centered: true, size: 'lg' });
  }

  userBoxHeading: string = '';
  handleEditUser(adduser: TemplateRef<any>, userData: any) {
    this.userBoxHeading = 'Edit';
    // Disable the email and password fields
    this.userForm.get('email')?.disable();
    this.userForm.get('password')?.disable();

    this.userForm.patchValue({
      "firstName": userData.firstname,
      "lastName": userData.lastname,
      "email": userData.email,
      "phone": userData.phone,
      "password": userData.passwrd,
      "password_confirmation": userData.passwrd,
      "role": userData.roleid,
      "userid": userData.userid,
    })

    this.modalService.open(adduser, { centered: true, size: 'lg' });
  }

  handleEditUserSave() {
    if (this.userForm.valid) {
      const data = {
        "firstname": this.userForm.get('firstName')?.value || '',
        "lastname": this.userForm.get('lastName')?.value || '',
        "phone": this.userForm.get('phone')?.value || '',
        'role': this.userForm.get('role')?.value,
        "userid": this.userForm.get('userid')?.value || '',
      }

      this._usermanagementService.updateUser(data).subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.userForm.reset();
            this.getUsersFun({
              "limit": +this.limit_user_list,
              "search": this.search_user_list,
              "start": (this.currentPage - 1) * this.limit_user_list,
              "end": this.currentPage * this.limit_user_list,
            })
          } else {
            if (res.message) {
              this._toastr.error(res.message, 'Error!');
            } else {
              console.log(res);
            }
          }
        },
        error: (err) => {
          if (err.message) {
            this._toastr.error(err.message, 'Error!');
          } else {
            console.log(err);
          }
        }
      })


    } else {
      console.log(this.userForm.controls);
      this.userForm.markAllAsTouched(); // Trigger validation messages
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }


  handleDeleteUser(deleteConfirmBox: TemplateRef<any>) {
    this.modalService.open(deleteConfirmBox, { centered: true, size: 'md' });
    // this.handleOrderDeleteData=data;
  }
  isUserSave: boolean = false;
  handleUserSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted:', this.userForm.value);
      this.isUserSave = true;  // Start "Save" button loader
      const data = {
        'firstname': this.userForm.get('firstName')?.value || '',
        'lastname': this.userForm.get('lastName')?.value || '',
        'email': this.userForm.get('email')?.value || '',
        'phone': this.userForm.get('phone')?.value || '',
        'password': this.userForm.get('password')?.value || '',
        'role': this.userForm.get('role')?.value || '',
        'createdby': this.localData.userid,
      }

      this._usermanagementService.createUsers(data).subscribe({
        next: (res) => {
          if (res) {
            this.isUserSave = false;  // Stop "Save" button loader
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.userForm.reset();
            this.getUsersFun({
              "limit": +this.limit_user_list,
              "search": this.search_user_list,
              "start": (this.currentPage - 1) * this.limit_user_list,
              "end": this.currentPage * this.limit_user_list,
            })
            // this.getAllUserFun(); //call again user list api
          } else {
            this.isUserSave = false;  // Stop "Save" button loader
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          this.isUserSave = false;  // Stop "Save" button loader\
          console.error('users failed', err);
          this._toastr.error(err.message, 'Error!');
        }
      });


    } else {
      console.log(this.userForm.value);
      this.userForm.markAllAsTouched(); // Trigger validation messages
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }


  userFormReset() {
    this.userForm.reset();
  }

  passwordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  conPasswordVisible: boolean = false;

  toggleConPasswordVisibility(): void {
    this.conPasswordVisible = !this.conPasswordVisible;
  }

  // test
  changeStatusUserId: any;
  changeUserStatus: any;
  userStatusTitleMsg: any = '';
  userStatusContentMsg: any = '';

  changeStatusUserConfirmFunc(changeStatusUserConfirm: TemplateRef<any>, id: any, status: any, userDelete: any = false, user: any) {
    this.modalService.open(changeStatusUserConfirm, { centered: true, size: 'md' });
    this.changeStatusUserId = id;
    if (status == 'delete' || status == 'deleted') {
      this.userStatusTitleMsg = `delete ${user.firstname} ${user.lastname}?`
      this.userStatusContentMsg = `Are you sure you want to delete User?`;
      this.changeUserStatus = status;
      if (userDelete == "userDelete") {
        this.userStatusTitleMsg = `delete/active  ${user.firstname} ${user.lastname}?`
        this.userStatusContentMsg = 'Are you sure you want to delete user to active User?';
        this.changeUserStatus = 'active';
      }
      else {
        this.userStatusTitleMsg = `delete  ${user.firstname} ${user.lastname}?`
        this.userStatusContentMsg = 'Are you sure you want to delete User?';
        this.changeUserStatus = status;
      }
    }
    else if (status == 'active') {
      this.userStatusTitleMsg = `inactive  ${user.firstname} ${user.lastname}?`
      this.userStatusContentMsg = 'Are you sure you want to inactive User?';
      this.changeUserStatus = 'inactive';
    }
    else if (status == 'inactive') {
      this.userStatusTitleMsg = `active ${user.firstname} ${user.lastname}?`
      this.userStatusContentMsg = 'Are you sure you want to active User?';
      this.changeUserStatus = 'active';
    }

  }

  changeStatusUserYesFunc() {

    if (this.changeUserStatus == 'delete') {
      const data = {
        "status": 'deleted',
        "userid": this.changeStatusUserId
      };
      this.userStatusChangeFunc(data);
    } else {
      const data = {
        "status": this.changeUserStatus,
        "userid": this.changeStatusUserId
      };
      this.userStatusChangeFunc(data);
    }

  }

  userStatusChangeFunc(data: any) {
    this._usermanagementService.updateUserStatus(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          this.modalService.dismissAll();

          this.getUsersFun({
            "limit": +this.limit_user_list,
            "search": this.search_user_list,
            "start": (this.currentPage - 1) * this.limit_user_list,
            "end": this.currentPage * this.limit_user_list,
          })
        } else {
          if (res.message) {
            this._toastr.error(res.message, 'Error!');
          } else {
            console.log(res);
          }
        }
      },
      error: (err) => {
        if (err.message) {
          this._toastr.error(err.message, 'Error!');
        } else {
          console.log(err);
        }
      }
    });
  }


  phoneNumberChange(event: any): void {
    const input = event.target as HTMLInputElement;
    let phone = input.value.replace(/\D/g, ''); // Remove all non-numeric characters

    // Allow the field to be completely cleared
    if (phone === '') {
      this.userForm.controls['phone'].setValue('', { emitEvent: false });
      return;
    }

    // Ensure the phone number starts with "351"
    if (!phone.startsWith('351')) {
      phone = '351' + phone;
    }

    // Format the number as +351 XXX XXX XXX
    if (phone.length > 3 && phone.length <= 6) {
      phone = `+351 ${phone.slice(3, 6)}`;
    } else if (phone.length > 6 && phone.length <= 9) {
      phone = `+351 ${phone.slice(3, 6)} ${phone.slice(6, 9)}`;
    } else if (phone.length > 9) {
      phone = `+351 ${phone.slice(3, 6)} ${phone.slice(6, 9)} ${phone.slice(9, 12)}`;
    } else if (phone.length > 0) {
      phone = `+351 ${phone.slice(3)}`;
    }

    // Update the input value and form control
    input.value = phone.trim();
    this.userForm.controls['phone'].setValue(phone.trim(), { emitEvent: false });
  }





  // test end

}
