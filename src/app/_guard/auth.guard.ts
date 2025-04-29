import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const localData = localStorage.getItem('token');

    const _router = inject(Router);

    if(localData != null){
      return true;
    }else{
      _router.navigateByUrl('/auth/signin')
      return false;
    }
};
