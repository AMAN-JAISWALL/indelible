import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfilePicService {

  public profilePicChange$ : Subject<any>  = new Subject<any>
  constructor() { }
}
