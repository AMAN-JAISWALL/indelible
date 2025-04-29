// angular import
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/_servies/auth.service';

// project import
import { SharedModule } from 'src/app/theme/shared/shared.module';

@Component({
  selector: 'app-sign-in',
  standalone: true,
  imports: [SharedModule, RouterModule, ReactiveFormsModule],
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export default class SignInComponent {

  private _router = inject(Router);
  private _authService = inject(AuthService);
  private _toastr = inject(ToastrService)
  // global variables
  isPasswordVisible: boolean = false;

  // forms
  signInForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rememberMe: new FormControl(false)
  });

  //constructor
  constructor() { }

  ngOnInit() {
    console.log("window Link>>", window.location.href);
    this.onRememberMeFun()
  }

  // // generate a random code
  // generateRandomCode(length: number) {
  //   const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  //   let result = '';
  //   for (let i = 0; i < length; i++) {
  //     result += characters.charAt(Math.floor(Math.random() * characters.length));
  //   }
  //   return result;
  // }

  handleSingIn() {
    if (this.signInForm.valid) {
      //call api start
      // {"username": "meena@itsabacus.com", "password": "fin@1234"}
      let data = {
        username: this.signInForm.get('email')?.value,
        password: this.signInForm.get('password')?.value
      }

      this._authService.logIn(data).subscribe({
        next: (res) => {
          if (res.success) {
            // console.log("login", res);
            localStorage.setItem("token", res.csrfToken);
            localStorage.setItem("jwtToken", res.token);
            localStorage.setItem("userDetails", JSON.stringify(res.user.data));

            this._toastr.success(res.message, 'Success');

            // email code start
            // {"userid": 1, "code": "DSYDNN"}
            // const data = {
            //   "userid": res.user.data.userid,
            //   "code":res.user.data.verificationCode,
            // }
            // this.sendEmailCode(data)
            // email code end
            this._router.navigate(['/auth/verification']);

          } else {
            console.error('something went wrong', res);
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          console.error('Login failed', err);
          this._toastr.error(err.message, 'Error!');
        }
      });

      // api code end

      //remember me code start
      const email = this.signInForm.controls['email'].value;
      const password = this.signInForm.controls['password'].value;
      const rememberMe = this.signInForm.controls['rememberMe'].value;
      if (rememberMe) {
        this.setCookie('email', email, 30);
        this.setCookie('password', password, 30);
        this.setCookie('rememberMe', 'true', 30);
      } else {
        this.deleteCookie('email');
        this.deleteCookie('password');
        this.deleteCookie('rememberMe');
      }
      //remember me code end
    } else {
      console.log("signInForm is invalid ", this.signInForm.controls);
      this.signInForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }

  // set cookies 
  setCookie(name: string, value: string, days: number) {
    const d = new Date();
    d.setTime(d.getTime() + (days * 24 * 60 * 60 * 1000)); // expiry in days
    const expires = `expires=${d.toUTCString()}`;
    document.cookie = `${name}=${value}; ${expires}; path=/`;
  }

  // delete a cookie
  deleteCookie(name: string) {
    this.setCookie(name, '', -1);
  }


  // On "Remember Me" functionality
  onRememberMeFun() {
    const storedEmail = this.getCookie('email');
    const storedPassword = this.getCookie('password');
    const rememberMe = this.getCookie('rememberMe') === 'true';

    if (storedEmail && storedPassword && rememberMe) {
      this.signInForm.patchValue({
        email: storedEmail,
        password: storedPassword,
        rememberMe: rememberMe
      });
    }
  }

  // get a cookie
  getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
    return null;
  }

  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible; // For toggle the password type 
  }



}
