import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ProfilePicService } from 'src/app/_servies/usermanagement/profile-pic.service';
import { UsermanagementService } from 'src/app/_servies/usermanagement/usermanagement.service';

@Component({
  selector: 'app-website',
  templateUrl: './website.component.html',
  styleUrl: './website.component.scss'
})
export class WebsiteComponent {
  private _router = inject(Router);
  private _usermanagementService = inject(UsermanagementService);
  private _profilePicService = inject(ProfilePicService)
  isMenuOpen = false;

  localData:any={};
  userDataGetFormMyPPComponent:any={}
  userNameTooltipText: string = '';
  ngOnInit() {
    this._profilePicService.profilePicChange$.subscribe((res) => {
      this.userDataGetFormMyPPComponent = res;
      // console.log("userDataGetFormMyPPComponent",this.userDataGetFormMyPPComponent);
    })
    //start localStorage code
    const storedObj = localStorage.getItem('userDetails');
    if (storedObj) {
      const localUserDetails = JSON.parse(storedObj);
      this.localData = localUserDetails;
      this.userNameTooltipText =`${this.localData.firstname} ${this.localData.lastname}`;
      //this is for rxjx subject data save from nav component
      this._profilePicService.profilePicChange$.next(this.localData);
    } else {
      this._router.navigate(['/auth/signin'])
    }
    //end localStorage code
    this.getUserByIdFun();
  }


  async getUserByIdFun() {
    try {
      const res = await this._usermanagementService.getUserById(this.localData.userid).toPromise();
      if (res) {
        this.userDataGetFormMyPPComponent=res
        this._profilePicService.profilePicChange$.next(res);
      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res);
      }
    } catch (err) {
      console.error("Error:", err);

    }

  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  handleLogout(){
    localStorage.clear();
    this._router.navigate(['/auth/signin']);
  }
}
