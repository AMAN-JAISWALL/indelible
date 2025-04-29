// angular import
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_servies/auth.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export default class SignUpComponent {
  private _activatedRoute = inject(ActivatedRoute);
  private _toastr = inject(ToastrService)
  private _authService = inject(AuthService);
  private _router = inject(Router);

  // global var
  localData: any = {};

  // forms
  verificationForm: FormGroup = new FormGroup({
    code: new FormControl('', [Validators.required]),
    userid: new FormControl('', [Validators.required]),
  });

  ngOnInit() {

    //start localStorage code
    const storedObj = localStorage.getItem('userDetails');
    if (storedObj) {
      const localUserDetails = JSON.parse(storedObj);
      this.localData = localUserDetails;
      this.verificationForm.patchValue({
        "userid": this.localData.userid
      });
    } else {
      this._router.navigate(['/auth/signin'])
    }
    //end localStorage code

    //getting code
    // const code = history.state.passCode;
    // console.log("this is code getting by login component>>",code);


  }

  handleVerify() {
    if (this.verificationForm.valid) {
      const data = {
        "userid": this.verificationForm.get("userid")?.value,
        "code":  this.verificationForm.get("code")?.value,
      }
      this._authService.verify(data).subscribe({
        next: (res) => {
          if (res.success) {
            console.log("login", res);
           
            if(this.localData.roleid==1){
              this._router.navigate(['/website/dashboard']);
            }else{
              this._router.navigate(['/website/reservation']);
            }
            this._toastr.success(res.message, 'Success');
          } else {
            console.error('something went wrong', res);
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          this._toastr.error(err.message, 'Error!');
        }
      });
    } else {
      this.verificationForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }

  }

  handleResend(){

    const data = {
      "userid":this.localData.userid,
      "email": this.localData.email,
    }
    this._authService.resendcode(data).subscribe({
      next: (res) => {
        if (res.success) {
          this._toastr.success(res.message, 'Success');
          // this._router.navigate(['/website/dashboard']);
        } else {
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        this._toastr.error(err.message, 'Error!');
      }
    });

  }


}
