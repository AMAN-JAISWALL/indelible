import { Component, inject, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { passwordMatchValidatorForChangePassword } from 'src/app/_customValidation/password-match.validator';
import { ProfilePicService } from 'src/app/_servies/usermanagement/profile-pic.service';
import { UsermanagementService } from 'src/app/_servies/usermanagement/usermanagement.service';

@Component({
  selector: 'app-outdoorliving',
  templateUrl: './outdoorliving.component.html',
  styleUrl: './outdoorliving.component.scss'
})
export class OutdoorlivingComponent {

  private modalService = inject(NgbModal);
  private _toastr = inject(ToastrService);
  private _router = inject(Router);
  private _usermanagementService = inject(UsermanagementService);
  private _profilePicService = inject(ProfilePicService)

  //global var
  active = 1;
  imgSrc = "assets/images/user/img-avatar-2.jpg"
  localData: any = {};

  //form
  myProfileForm: FormGroup = new FormGroup({
    userid: new FormControl('', [Validators.required]),
    roleid: new FormControl('', ),
    firstname: new FormControl('', [Validators.required]),
    lastname: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required,  Validators.pattern(/^\+351\s\d{3}\s\d{3}\s\d{3}$/),]),
    email: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,5}$/), Validators.maxLength(100)]),

    profilepic: new FormControl('',),
    userstatus: new FormControl('',),
  })

   //here_uploading_profile_pic_form
   profilePicUploadinForm :FormGroup = new FormGroup({
    profilePic:new FormControl( null, [Validators.required]),
  })

    //update/change password form
    updatePasswordForm :FormGroup = new FormGroup({
      userid:new FormControl('',),
      old_password: new FormControl('', [Validators.required]),
      new_password: new FormControl('', [Validators.required, Validators.minLength(8)]),
      new_password_confirmation: new FormControl('', [Validators.required]),
    }, { validators: passwordMatchValidatorForChangePassword })
  

  ngOnInit() {
    // console.log("outDoorliving running");
    //start localStorage code
    const storedObj = localStorage.getItem('userDetails');
    if (storedObj) {
      const localUserDetails = JSON.parse(storedObj);
      this.localData = localUserDetails;
    } else {
      this._router.navigate(['/auth/signin'])
    }
    //end localStorage code
    this.getUserByIdFun();
  }
  getUserByIdData:any={};
  async getUserByIdFun() {
    try {
      const res = await this._usermanagementService.getUserById(this.localData.userid).toPromise();
      if (res) {
        this.getUserByIdData=res;
        this.myProfileForm.patchValue({
          "userid": res.userid,
          "roleid": res.roleid,
          "firstname": res.firstname,
          "lastname": res.lastname,
          "phone": res.phone,
          "email": res.email,
          "profilepic": res.profilepic,
          "userstatus": res.userstatus,
        })
        this._profilePicService.profilePicChange$.next(res);
        // this.getUserByIdData = res;
        // console.log("getUserByIdData>>", this.getUserByIdData);

      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);

    }

  }

  editUser() {

    if (this.myProfileForm.valid) {
      const data = {
        "firstname": this.myProfileForm.get('firstname')?.value || '',
        "lastname": this.myProfileForm.get('lastname')?.value || '',
        "phone": this.myProfileForm.get('phone')?.value || '',
        "userid": this.myProfileForm.get('userid')?.value || '',
      }

      this._usermanagementService.updateUser(data).subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toastr.success(res.message, 'Success');
            // this.modalService.dismissAll();
            // this.myProfileForm.reset();
            // this.getUsersFun()
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
      this.myProfileForm.markAllAsTouched(); // Trigger validation messages
      this._toastr.error("Something went wrong", "Action Error!");
    }

  }

  triggerFileInput() {
    const fileInput = document.getElementById('profilePic') as HTMLInputElement;
    fileInput.click();
  }

   // Handle file input change event
   onFileSelected(event: any): void {
    // debugger;
    console.log(event);
    if(event.target.files.length > 0){
      // console.log(event);
      const file =event.target.files[0];
      if(file.type == 'image/png' || file.type == 'image/jpeg'){
        const user_id = this.myProfileForm.get('userid')?.value || '';
      const formData = new FormData();
      formData.append('file',file);
      formData.append('userid',user_id);
        this._usermanagementService.updateProfilePicture(formData).subscribe({
          next : (res) =>{
            if(res.success && res.message){
              this._toastr.success(res.message, 'Success');
              this.getUserByIdFun();
            }else{
              if(res.message){
                this._toastr.error(res.message, 'Error!');
              }else{
                console.log(res);
              }
            } 
          },
          error : (err)=>{
            if(err.message){
              this._toastr.error(err.message, 'Error!');
            }else{
              console.log(err);
            }
          }
        })
      }else{
        this._toastr.error("Only PNG or JPEG image types are allowed.", 'Error!');
      }
      
    }else{
      this._toastr.error("Your file is not selected properly.", 'Error!');
    }
  }

  updatePassword(update: TemplateRef<any>) {
    this.modalService.open(update, { centered: true });
  }

  isPasswordChange:boolean=false;
  UpdatepasswordFun(){
    if (!this.updatePasswordForm.valid) {
      this.updatePasswordForm.markAllAsTouched(); // Highlight invalid fields
      return;  
    }
    this.isPasswordChange=true;
    // this.updatePasswordForm.disable();
    // this.updatePasswordForm.value.userid=this.localData.userid;
    this.updatePasswordForm.patchValue({
      'userid':this.localData.userid
    })
    this._usermanagementService.Updatepassword(this.updatePasswordForm.value).subscribe({
      next : (res) =>{
        if(res.success && res.message){
          this.isPasswordChange=false;
          this._toastr.success(res.message, 'Success');
          // this.updatePasswordForm.enable();
          this.modalService.dismissAll();
          this.updatePasswordForm.reset();
        }else{
          if(res.message){
            this.isPasswordChange=false;
            this._toastr.error(res.message, 'Error!');
          }else{
            this.isPasswordChange=false;
            console.log(res);
          }
        } 
      },
      error : (err)=>{
        if(err.error.message){
          this.isPasswordChange=false;
          this._toastr.error(err.error.message, 'Error!');
        }else{
          this.isPasswordChange=false;
          console.log(err);
        }
      }
    })
  }
  updatePasswordFormReset(){
    this.updatePasswordForm.enable();
    this.updatePasswordForm.reset();
  }

  phoneNumberChange(event: any): void {
    const input = event.target as HTMLInputElement;
    let phone = input.value.replace(/\D/g, ''); // Remove all non-numeric characters
  
    // Allow the field to be completely cleared
    if (phone === '') {
      this.myProfileForm.controls['phone'].setValue('', { emitEvent: false });
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
    this.myProfileForm.controls['phone'].setValue(phone.trim(), { emitEvent: false });
  }
  isOldPasswordVisible: boolean = false;
  toggleOldPasswordVisibility() {
    this.isOldPasswordVisible = !this.isOldPasswordVisible; // For toggle the password type 
  }
  isNewPasswordVisible: boolean = false;
  toggleNewPasswordVisibility(){
    this.isNewPasswordVisible = !this.isNewPasswordVisible; 
  }
  isConPasswordVisible:boolean=false;
  toggleConPasswordVisibility(){
    this.isConPasswordVisible = !this.isConPasswordVisible; 
  }


  openVerticallyCentered(newuser: TemplateRef<any>) {
    this.modalService.open(newuser, { centered: true, size: 'lg' });
  }
  openVerticallyCenteredSec(newaccount: TemplateRef<any>) {
    this.modalService.open(newaccount, { centered: true, size: 'lg' });
  }
  accountAddress(newaccountaddress: TemplateRef<any>) {
    this.modalService.open(newaccountaddress, { centered: true, size: 'lg' });
  }


  updatePassword1(update1: TemplateRef<any>) {
    this.modalService.open(update1, { centered: true });
  }


  isUser: boolean = false;

  checkUser() {
    this.isUser = !this.isUser;
  }

}
