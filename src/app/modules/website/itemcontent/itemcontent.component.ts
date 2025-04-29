import { Component, inject, TemplateRef } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Search } from 'angular2-multiselect-dropdown';
import { ToastrService } from 'ngx-toastr';
import { HotelsService } from 'src/app/_servies/hotels/hotels.service';

@Component({
  selector: 'app-itemcontent',
  templateUrl: './itemcontent.component.html',
  styleUrl: './itemcontent.component.scss'
})
export class ItemcontentComponent {
  private modalService = inject(NgbModal);
  private _toastr = inject(ToastrService)
  private _hotelService = inject(HotelsService);
  private _router = inject(Router);
  //global variable
  messageCount: number = 5;
  rating = 5;
  hotelHeading: string = '';


  // global var
  localData: any = {};
  getHotelsData: any[] = [];

  //add edit form
  hotelForm: FormGroup = new FormGroup({
    hotelId: new FormControl('',),
    rating: new FormControl('', [Validators.required]),
    hotelName: new FormControl('', [Validators.required, Validators.minLength(3)]),
    contractedRate: new FormControl('', [Validators.required]),
    contractRate: new FormControl({ value: '', disabled: true },),
    telephone: new FormControl('', [Validators.required, Validators.pattern(/^\+351\s\d{3}\s\d{3}\s\d{3}$/),]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')]),
    country: new FormControl({ value: 'Portugal', disabled: true }, [Validators.required, Validators.pattern('^[a-zA-Z]+(?:[\\s-][a-zA-Z]+)*$')]),
    postCode: new FormControl('', [Validators.required, Validators.pattern(/^\d{4}-\d{3}$/)]),
    currency: new FormControl('', [Validators.required]),
    totalRooms: new FormControl('', [Validators.required, Validators.min(1)]),
    restaurant: new FormControl(null, [Validators.required]),

    mainContactPerson: new FormControl('', [Validators.required]),
    mainContactEmail: new FormControl('', [Validators.required, Validators.email]),
    financePerson: new FormControl('', [Validators.required]),
    financeEmail: new FormControl('', [Validators.required, Validators.email]),
    petFriendly: new FormControl('', [Validators.required]),
    petAllowance: new FormControl({ value: '', disabled: true },),
    dinnerRate: new FormControl({ value: '', disabled: true },),
    breakfastRate: new FormControl('', [Validators.required]),

    port: new FormControl(null, [Validators.required]),
  });

  hotelPortSearchForm: FormGroup = new FormGroup({
    port: new FormControl(null,),
    search: new FormControl(null,),
  });

  hotelAvailabilityForm: FormGroup = new FormGroup({
    rooms: new FormControl('', [Validators.required]),
    message: new FormControl('', [Validators.required]),
  });

  hotelEditNotesMsgForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

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
    this.getHotels({});
    this.getAllPorts();

  }

  getAllPortsData: any[] = [];
  async getAllPorts() {
    try {
      const res = await this._hotelService.portList().toPromise();
      if (res) {
        this.getAllPortsData = res.data;
      } else {
        this._toastr.error('Error: Unable to fetch the portList', 'Error');
      }
    } catch (err) {
      // this._toastr.error('Error: Unable to fetch the portList', 'Error');
      console.error("An error occurred:", err);
    }
  }

  isLoading1: boolean = true;
  async getHotels(data: any) {
    try {
      const res = await this._hotelService.getHotels(data).toPromise();
      if (res) {
        this.getHotelsData = res.data;
        this.isLoading1 = false;
      } else {
        this.isLoading1 = false;
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      this.isLoading1 = false;
      console.error("Error:", err);
    }
  }
  isAddHotelSaving: boolean = false;
  openAddHotel(hotelAddEdit: TemplateRef<any>) {
    // this.modalService.open(addhotel, { centered: true, size:'lg' });
    this.hotelForm.reset();
    this.hotelForm.get('contractRate')?.disable();
    this.hotelForm.get('petAllowance')?.disable();
    // this.hotelForm.get('breakfastRate')?.disable();
    this.hotelForm.get('dinnerRate')?.disable();
    this.hotelForm.patchValue({ 'country': 'Portugal' })
    this.hotelHeading = 'Add';
    this.modalService.open(hotelAddEdit, { centered: true, size: 'xl custom-modal' });
  }

  handleAddHotelSaveBtn() {
    if (this.hotelForm.valid) {
      this.isAddHotelSaving = true;
      const data = {
        "hotel_name": this.hotelForm.get("hotelName")?.value || '',
        "address": this.hotelForm.get("address")?.value || '',
        "city": this.hotelForm.get("city")?.value || '',
        "country": this.hotelForm.get("country")?.value || '',
        "postcode": this.hotelForm.get("postCode")?.value || '',
        "telephone": this.hotelForm.get("telephone")?.value || '',
        "contractual_rate": this.hotelForm.get("contractedRate")?.value || '',
        "contract_rate": this.hotelForm.get("contractRate")?.value || '',
        "contact_person": this.hotelForm.get("mainContactPerson")?.value || '',
        "contact_person_email": this.hotelForm.get("mainContactEmail")?.value || '',
        "finance_person": this.hotelForm.get("financePerson")?.value || '',
        "finance_person_email": this.hotelForm.get("financeEmail")?.value || '',
        "currency": this.hotelForm.get("currency")?.value || '',
        "total_rooms": this.hotelForm.get("totalRooms")?.value || '',
        "stars": this.hotelForm.get("rating")?.value || '',
        "pet_friendly": this.hotelForm.get("petFriendly")?.value || '',
        "pet_allowance_rate": this.hotelForm.get("petAllowance")?.value || '',
        "restaurant": this.hotelForm.get("restaurant")?.value || '',
        "dinner_rate": this.hotelForm.get("dinnerRate")?.value || '',
        "breakfast_rate": this.hotelForm.get("breakfastRate")?.value || '',
        "email": this.hotelForm.get("email")?.value || '',
        "createdBy": this.localData.userid || "",
        "port": this.hotelForm.get("port")?.value || '',
      };

      this._hotelService.addHotel(data).subscribe({
        next: (res) => {
          if (res) {
            this.isAddHotelSaving = false;
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.hotelForm.reset();
            this.hotelForm.get('contractRate')?.disable();
            this.hotelForm.patchValue({ 'contractRate': "" })
            this.hotelForm.get('petAllowance')?.disable();
            // this.hotelForm.get('breakfastRate')?.disable();
            this.hotelForm.get('dinnerRate')?.disable();
            this.getHotels({});
            // this.getUsersFun({
            //   "limit": +this.limit_user_list,
            //   "search": this.search_user_list,
            //   "start": (this.currentPage - 1) * this.limit_user_list,
            //   "end": this.currentPage * this.limit_user_list,
            // })
            // this.getAllUserFun(); //call again user list api
          } else {
            this.isAddHotelSaving = false;
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          this.isAddHotelSaving = false;
          console.error('users failed', err);
          this._toastr.error(err.message, 'Error!');
        }
      });

    } else {
      this.hotelForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }

  resetHotelForm() {
    this.hotelForm.reset();
    this.hotelForm.get('contractRate')?.disable();
    this.hotelForm.get('petAllowance')?.disable();
    // this.hotelForm.get('breakfastRate')?.disable();
    this.hotelForm.get('dinnerRate')?.disable();
  }
  realHotelId: number = 0;
  handleHotelEdit(hotelAddEdit: TemplateRef<any>, data: any) {
    this.hotelForm.get('hotelId')?.disable();
    this.hotelForm.get('contractRate')?.enable();
    this.hotelForm.get('petAllowance')?.enable();
    this.hotelForm.get('dinnerRate')?.enable();
    this.hotelHeading = 'Edit';
    this.realHotelId = data.hotel_id;
    this.hotelForm.patchValue({
      hotelId: "#H000" + data.hotel_id,
      hotelName: data.hotel_name,
      rating: data.stars,
      contractedRate: data.contractual_rate === 'YES' ? 'Yes' : 'No',
      contractRate: data.contract_rate,
      telephone: data.telephone,
      email: data.email,
      address: data.address,
      city: data.city,
      country: data.country,
      postCode: data.postcode,
      currency: data.currency,
      totalRooms: data.total_rooms,
      restaurant: data.restaurant === 'YES' ? 'Yes' : 'No',
      mainContactPerson: data.contact_person,
      mainContactEmail: data.contact_person_email,
      financePerson: data.finance_person,
      financeEmail: data.finance_person_email,
      petFriendly: data.pet_friendly === 'YES' ? 'Yes' : 'No',
      petAllowance: data.pet_allowance_rate,
      dinnerRate: data.dinner_rate,
      breakfastRate: data.breakfast_rate,
      port: data.port
    })

    this.modalService.open(hotelAddEdit, { centered: true, size: 'xl custom-modal' });
  }

  isEditHotelSaving: boolean = false;
  handleEditHotelSaveBtn() {

    if (this.hotelForm.valid) {
      // console.log("update hotel");
      this.isEditHotelSaving = true;
      const data = {
        hotel_id: this.realHotelId || '',
        hotel_name: this.hotelForm.get("hotelName")?.value || '',
        address: this.hotelForm.get("address")?.value || '',
        city: this.hotelForm.get("city")?.value || '',
        country: this.hotelForm.get("country")?.value || '',
        postcode: this.hotelForm.get("postCode")?.value || '',
        telephone: this.hotelForm.get("telephone")?.value || '',
        email: this.hotelForm.get("email")?.value || '',
        contractual_rate: this.hotelForm.get("contractedRate")?.value || '',
        contract_rate: this.hotelForm.get("contractRate")?.value || '',
        contact_person: this.hotelForm.get("mainContactPerson")?.value || '',
        contact_person_email: this.hotelForm.get("mainContactEmail")?.value || '',
        finance_person: this.hotelForm.get("financePerson")?.value || '',
        finance_person_email: this.hotelForm.get("financeEmail")?.value || '',
        currency: this.hotelForm.get("currency")?.value || '',
        total_rooms: this.hotelForm.get("totalRooms")?.value || '',
        stars: this.hotelForm.get("rating")?.value || '',
        pet_friendly: this.hotelForm.get("petFriendly")?.value || '',
        pet_allowance_rate: this.hotelForm.get("petAllowance")?.value || '',
        restaurant: this.hotelForm.get("restaurant")?.value || '',
        dinner_rate: this.hotelForm.get("dinnerRate")?.value || '',
        breakfast_rate: this.hotelForm.get("breakfastRate")?.value || '',
        port: this.hotelForm.get("port")?.value || '',
        updatedby: this.localData.userid
      };


      this._hotelService.updateHotel(data).subscribe({
        next: (res) => {
          if (res && res.message) {
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.hotelForm.reset();
            this.hotelForm.get('contractRate')?.disable();
            this.hotelForm.get('petAllowance')?.disable();
            // this.hotelForm.get('breakfastRate')?.disable();
            this.hotelForm.get('dinnerRate')?.disable();
            this.isEditHotelSaving = false;
            const data = {
              port: this.hotelPortSearchForm.get("port")?.value || '',
              hotel_name: this.hotelPortSearchForm.get("search")?.value,
            }
            this.getHotels(data);
          } else {
            if (res.message) {
              this.isEditHotelSaving = false;
              this._toastr.error(res.message, 'Error!');
            } else {
              this.isEditHotelSaving = false;
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
      // console.log('hotelForm.invalid', this.hotelForm.controls);
      this.hotelForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }

  handlePortSearch() {
    this.isLoading1 = true;
    //for string null
    const portPayloadManage = this.hotelPortSearchForm.get("port")?.value === "null" ? '' : this.hotelPortSearchForm.get("port")?.value;
    const data = {
      port: portPayloadManage || '',
      hotel_name: this.hotelPortSearchForm.get("search")?.value || '',
    }
    this.getHotels(data);
  }
  resetPortSearch() {
    this.hotelPortSearchForm.reset();
    // console.log(this.hotelPortSearchForm.controls);
    this.isLoading1 = true;
    this.getHotels({});
  }

  onInputSearchByHotelName(e: any) {
    // console.log("hotelName>>",e.target.value);
    let search = e.target.value;
    const portPayloadManage = this.hotelPortSearchForm.get("port")?.value === "null" ? '' : this.hotelPortSearchForm.get("port")?.value;
    const data = {
      port: portPayloadManage || '',
      hotel_name: search,
    }
    this.getHotels(data);
  }

  portOnChange(e: any) {
    let port_value = e.target.value === "" ? null : e.target.value;
    if (port_value == "0: null") {
      port_value = '';
    }

    const data = {
      port: port_value || '',
      hotel_name: this.hotelPortSearchForm.get("search")?.value,
    }
    this.getHotels(data);

  }


  hotelAvailabilityData: any = {}
  hotelAvailabilityHeading: string = '';
  openAddHotelAvailability(hotelavailability: TemplateRef<any>, data: any) {
    this.hotelAvailabilityData = data;
    this.hotelAvailabilityHeading = data.hotel_name;
    // console.log("hotelAvailabilityData>>>", this.hotelAvailabilityData);
    this.modalService.open(hotelavailability, { centered: true, size: 'lg' });
  }
  isHotelAvailabilitySaving: boolean = false;
  handleHotelAvailabilitySave() {
    if (this.hotelAvailabilityForm.valid) {
      this.isHotelAvailabilitySaving = true;
      const data = {
        "roomId": this.hotelAvailabilityForm.get('rooms')?.value || "",
        "comment": this.hotelAvailabilityForm.get('message')?.value || "",
        "hotel_id": this.hotelAvailabilityData.hotel_id,
        "createdBy": this.localData.userid || "not found",
        "createdByName": `${this.localData.firstname ?? ""} ${this.localData.lastname ?? ""}` || "not found",
      }
      // console.log("payload", data);

      this._hotelService.addHotelAvailability(data).subscribe({
        next: (res) => {
          if (res) {
            this.isHotelAvailabilitySaving = false;
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.hotelAvailabilityForm.reset();
            const data = {
              port: this.hotelPortSearchForm.get("port")?.value || '',
              hotel_name: this.hotelPortSearchForm.get("search")?.value,
            }
            this.getHotels(data);
          } else {
            this.isHotelAvailabilitySaving = false;
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          this.isHotelAvailabilitySaving = false;
          this._toastr.error(err.message, 'Error!');
        }
      });


    } else {
      // console.log('hotelAvailabilityForm.invalid', this.hotelAvailabilityForm.controls);
      this.hotelAvailabilityForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }

  handleHotelAvailabilityFormReset() {
    this.hotelAvailabilityForm.reset();
  }

  openGetHotelAvailabilityData: any = {}
  openGetHotelAvailabilityHeading: string = '';
  getHotelAvailabilityData: any[] = [];
  async openGetHotelAvailability(getHotelAvailability: TemplateRef<any>, data: any) {
    this.openGetHotelAvailabilityData = data;
    this.openGetHotelAvailabilityHeading = data.hotel_name;
    // console.log("openGetHotelAvailabilityData>>",this.openGetHotelAvailabilityData);

    try {
      const data = {
        "hotel_id": this.openGetHotelAvailabilityData.hotel_id || "N/A"
      }
      const res = await this._hotelService.getHotelAvailability(data).toPromise();
      if (res) {
        const filteredData = res.data.filter((item: any) => item.roomId !== 0);
        this.getHotelAvailabilityData = res.data;
        // this.isLoading1 = false;
        // console.log("getHotelsData>>", this.getHotelsData);
      } else {
        // this.isLoading1 = false;
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      // this.isLoading1 = false;
      console.error("Error:", err);
    }



    this.modalService.open(getHotelAvailability, { centered: true, size: 'lg' });
  }

  openHotelNoteEditData: any = {};
  openHotelNoteEdit(hotelnoteedit: TemplateRef<any>, data: any) {
    this.openHotelNoteEditData = data;
    this.modalService.open(hotelnoteedit, { centered: true, size: 'lg' });
  }
  isHotelEditNoteSaving: boolean = false;
  handleEditNoteSave() {
    if (this.hotelEditNotesMsgForm.valid) {
      this.isHotelEditNoteSaving = true;
      const data = {
        "roomId": 0,
        "comment": this.hotelEditNotesMsgForm.get('message')?.value || "",
        "hotel_id": this.openHotelNoteEditData.hotel_id,
        "createdBy": this.localData.userid || "not found",
        "createdByName": `${this.localData.firstname ?? ""} ${this.localData.lastname ?? ""}` || "not found",
      }
      this._hotelService.addHotelAvailability(data).subscribe({
        next: (res) => {
          if (res) {
            this.isHotelEditNoteSaving = false;
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.hotelEditNotesMsgForm.reset();
            const data = {
              port: this.hotelPortSearchForm.get("port")?.value || '',
              hotel_name: this.hotelPortSearchForm.get("search")?.value,
            }
            this.getHotels(data);
          } else {
            this.isHotelEditNoteSaving = false;
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          this.isHotelEditNoteSaving = false;
          this._toastr.error(err.message, 'Error!');
        }
      });
    } else {
      this.hotelEditNotesMsgForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }

  handleHotelEditNotesMsgFormFormReset() {
    this.hotelEditNotesMsgForm.reset();
  }

  getActionListHeading: string = '';
  getActionListData: any = {};
  getHotelActivityListData: any[] = [];
  async openHotelAction(hotelacton: TemplateRef<any>, data: any) {
    this.getActionListHeading = data.hotel_name;
    this.getActionListData = data;
    try {
      const data = {
        "hotel_id": this.getActionListData.hotel_id || "N/A"
      }
      const res = await this._hotelService.getHotelActivityList(data).toPromise();
      if (res) {
        this.getHotelActivityListData = res.data;
        // this.isLoading1 = false;
        // console.log("getHotelsData>>", this.getHotelsData);
      } else {
        // this.isLoading1 = false;
        this._toastr.error('Error: Unable to getHotelActivityList the portList', 'Error');
        console.error("Error: Unable to fetch getHotelActivityList. Status Code:", res.status_code);
      }
    } catch (err) {
      // this.isLoading1 = false;
      this._toastr.error('Error: Unable to getHotelActivityList the portList', 'Error');
      console.error("Error:", err);
    }

    this.modalService.open(hotelacton, { centered: true, size: 'lg' });
  }


  openSendEmail(sendemail: TemplateRef<any>) {
    this.modalService.open(sendemail, { centered: true, size: 'lg' });
  }




  contractedRateOnChange() {
    let value = this.hotelForm.get("contractedRate")?.value;
    // console.log("value", value);
    if (value == "Yes" || value == "YES" || value == 'yes') {
      // enable 
      this.hotelForm.get('contractRate')?.enable();
    } else if (value == "No" || value == "NO" || value == "no") {
      //disble
      this.hotelForm.get('contractRate')?.disable();
      this.hotelForm.patchValue({ 'contractRate': "" })
    } else {
      //disable
      this.hotelForm.get('contractRate')?.disable();
      this.hotelForm.patchValue({ 'contractRate': "" })
    }
  }

  petFriendlyOnChange() {
    let value = this.hotelForm.get("petFriendly")?.value;
    if (value == "Yes" || value == "YES" || value == 'yes') {
      // enable 
      this.hotelForm.get('petAllowance')?.enable();
    } else if (value == "No" || value == "NO" || value == "no") {
      //disble
      this.hotelForm.get('petAllowance')?.disable();
      this.hotelForm.patchValue({ 'petAllowance': "" })
    } else {
      //disable
      this.hotelForm.get('petAllowance')?.disable();
      this.hotelForm.patchValue({ 'petAllowance': "" })
    }
  }

  restaurantOnChange() {
    let value = this.hotelForm.get("restaurant")?.value;
    if (value == "Yes" || value == "YES" || value == 'yes') {
      // enable 
      // this.hotelForm.get('breakfastRate')?.enable();
      this.hotelForm.get('dinnerRate')?.enable();
    } else if (value == "No" || value == "NO" || value == "no") {
      //disble
      // this.hotelForm.get('breakfastRate')?.disable();
      this.hotelForm.get('dinnerRate')?.disable();
      this.hotelForm.patchValue({ "dinnerRate": "" })
    } else {
      //disable
      // this.hotelForm.get('breakfastRate')?.disable();
      this.hotelForm.get('dinnerRate')?.disable();
      this.hotelForm.patchValue({ "dinnerRate": "" })
    }
  }

  phoneNumberChange(event: any): void {
    const input = event.target as HTMLInputElement;
    let phone = input.value.replace(/\D/g, ''); // Remove all non-numeric characters

    // Allow the field to be completely cleared
    if (phone === '') {
      this.hotelForm.controls['telephone'].setValue('', { emitEvent: false });
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
    this.hotelForm.controls['telephone'].setValue(phone.trim(), { emitEvent: false });
  }

  postCodeChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let input = inputElement.value;

    // Remove all non-digit and non-hyphen characters
    input = input.replace(/[^0-9]/g, '');

    // Format as XXXX-XXX
    if (input.length > 4) {
      input = input.substring(0, 4) + '-' + input.substring(4, 7);
    }

    // Limit length to 8 characters (XXXX-XXX)
    if (input.length > 8) {
      input = input.substring(0, 8);
    }

    // Update the input element value
    inputElement.value = input;

    // Optionally, update the form control value
    this.hotelForm.controls['postCode'].setValue(input, { emitEvent: false });
  }

  hotelStatusHeading: string = '';
  hotelStatusDate: any = {};
  handleHotelStatus(conformationBox: TemplateRef<any>, data: any) {
    // console.log("status-data",data);
    if (data.status == 'Active') {
      this.hotelStatusHeading = "Inactive";
    } else if (data.status == 'Inactive') {
      this.hotelStatusHeading = "Active";
    } else {
      this.hotelStatusHeading = data.status;
    }
    this.hotelStatusDate = data;
    this.modalService.open(conformationBox, { centered: true, size: 'md' });
  }


  handleHotelUpdateStatusYes() {
    const data = {
      "hotel_id": this.hotelStatusDate.hotel_id || "N/A",
      "status": this.hotelStatusHeading || "N/A"
    }
    this._hotelService.updateStatus(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          const data = {
            port: this.hotelPortSearchForm.get("port")?.value || '',
            hotel_name: this.hotelPortSearchForm.get("search")?.value,
          }
          this.getHotels(data);
          this.modalService.dismissAll();
        } else {
          this._toastr.error('Error: Unable to update reservation status', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        this._toastr.error(err.error.message, 'Error!');
      }
    });
  }





}
