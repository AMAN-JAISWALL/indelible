import { HttpClient } from '@angular/common/http';
import { Component, inject, TemplateRef } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { dateValidator } from 'src/app/_customValidation/password-match.validator';
import { HotelsService } from 'src/app/_servies/hotels/hotels.service';
import { ReservationService } from 'src/app/_servies/reservation/reservation.service';
import { jsPDF } from 'jspdf';
import html2pdf from 'html2pdf.js';
import { DatePipe } from '@angular/common';
// import html2pdf from 'html2pdf.js';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  private modalService = inject(NgbModal);
  private _toastr = inject(ToastrService)
  private _reservationService = inject(ReservationService);
  private _hotelService = inject(HotelsService);//for getting all hotels details becuase we need inside add reservation
  private _router = inject(Router);

  // global var
  localData: any = {};
  selectedPort: any = null;
  selectedDate: string = "";
  selectedHotel: any = null;
  selectedAirline: any = null;
  selectedReservationNumber: string = '';

  search_user_list: string = '';
  limit_user_list: any = 10;
  totalRecords: any = 0;
  totalPages: any;
  pages: number[] = [];
  currentPage: number = 1;

  //step 1
  flightDetailsForm: FormGroup = new FormGroup({
    agentName: new FormControl('', [Validators.required, Validators.pattern('^[A-Za-z ]*$')]),
    requestingPort: new FormControl(null, [Validators.required]),
    requestReceived: new FormControl('', [Validators.required]),
    requestingAirline: new FormControl(null, [Validators.required]),
    flightNumber: new FormControl('', [Validators.required]),
    disruptionDate: new FormControl('', [Validators.required]),
  });

  // step 2
  hotelSelectionForm: FormGroup = new FormGroup({
    checkInDate: new FormControl('', [Validators.required]),
    checkOutDate: new FormControl('', [Validators.required]),
    hotel: new FormControl(null, [Validators.required]),
    commission: new FormControl('', [Validators.required, Validators.pattern('^[0-9]+%$')]),
  }, { validators: dateValidator });

  // step 3
  passengerDetailsAndAllowances: FormGroup = new FormGroup({
    rooms: new FormArray([]), // Use FormArray for rooms
  });

  //action_notes
  reservationEditNotesMsgForm: FormGroup = new FormGroup({
    message: new FormControl('', [Validators.required]),
  });

  //file_upload_form
  invoiceFileUpload: FormGroup = new FormGroup({
    reservationid: new FormControl(''),
    file: new FormControl(null, [Validators.required]),
  })

  constructor(private _http: HttpClient, private datePipe: DatePipe) {
    this.addRoom(); // Initialize with one room
  }

  get rooms() {
    return (this.passengerDetailsAndAllowances.get('rooms') as FormArray);
  }

  // Function to create a new room FormGroup
  createRoom(): FormGroup {
    return new FormGroup({
      rate: new FormControl('', [Validators.required]),
      room: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      pax: new FormControl('', [Validators.required, Validators.pattern('^[0-9]*$')]),
      customername: new FormControl('', [Validators.required]),
      breakfast: new FormControl(this.gettingHotelData.breakfast_rate),
      dinner: new FormControl(this.gettingHotelData.dinner_rate),
      no_show: new FormControl(false),
      no_show_foc: new FormControl(false),
      reservationdetailsid: new FormControl(''),
    }, { validators: this.noShowValidator });
  }
  // "No Show" and "No Show FOC" cannot both be true.Fun
  noShowValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const noShow = control.get('no_show')?.value;
    const noShowFoc = control.get('no_show_foc')?.value;
    return noShow && noShowFoc ? { noShowConflict: true } : null;
  };
  //end_validator

  // Function to add a new room
  addRoom(): void {
    // console.log("testing>>>", this.createRoom());
    this.rooms.push(this.createRoom());
    // this._toastr.success("Room added successfully.", "Success!");
  }

  // Function to remove a room
  removeRoom(index: number): void {
    if (index > 0) {
      this.rooms.removeAt(index);
      this._toastr.success("Room removed successfully.", "Success!");
    } else {
      this._toastr.error("The first room cannot be removed.", "Action Not Allowed!");
    }
  }

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
    // {"start":0, "limit":10,"end":1, "port":2}
    // port, reservationdate, hotelid, airline, reservationno
    const data = {
      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    }
    this.getAllReservation(data)
    this.getAllPorts();
    this.getAllAirlines();
    this.getActiveHotels();
  }


  steps = ['Flight details', 'Hotel Selection', 'Passenger Details and Allowances', 'Final Review and Confirmation'];
  currentStep = 0;


  // if (this.currentStep < this.steps.length - 1) {
  //   this.currentStep++;
  // }

  // nextStep(data: any) {
  //   console.log("data",data);
  //   if (data == 0) {

  //     console.log("current stap 0");
  //     if (this.flightDetailsForm.valid) {
  //       console.log("valid info",this.flightDetailsForm.value);
  //       if (this.currentStep < this.steps.length - 1) {
  //         this.currentStep++;
  //       }
  //     } else {
  //       console.log('hotelAvailabilityForm.invalid', this.flightDetailsForm.controls);
  //       this.flightDetailsForm.markAllAsTouched();
  //       this._toastr.error("Something went wrong", "Action Error!");
  //     }

  //   } else if (data == 1) {

  //     console.log("current stap 1");
  //     if (this.hotelSelectionForm.valid) {
  //       console.log("valid info",this.hotelSelectionForm.value);
  //       if (this.currentStep < this.steps.length - 1) {
  //         this.currentStep++;
  //       }
  //     } else {
  //       console.log('hotelSelectionForm.invalid', this.hotelSelectionForm.controls);
  //       this.hotelSelectionForm.markAllAsTouched();
  //       this._toastr.error("Something went wrong", "Action Error!");
  //     }



  //   }else if(data==2){
  //     // Passenger Details and Allowances
  //     if(this.passengerDetailsAndAllowances.valid){
  //       if (this.currentStep < this.steps.length - 1) {
  //         this.currentStep++;
  //       }
  //     }else{
  //       this.passengerDetailsAndAllowances.markAllAsTouched();
  //       this._toastr.error("Something went wrong", "Action Error!");
  //     }


  //   } else {
  //     this._toastr.error("Something went wrong", "Action Error!");
  //   }

  // }

  // prevStep() {
  //   if (this.currentStep > 0) {
  //     this.currentStep--;
  //   }
  // }

  // prevStepManage(){
  //   if (this.currentStep > 0) {
  //     this.currentStep--;
  //   }
  // }



  // Generic method to handle form validation and step navigation
  // validateAndNavigate(form: any, errorMessage: string) {
  //   if (form.valid) {
  //     console.log("Valid info", form.value);
  //     if (this.currentStep < this.steps.length - 1) {
  //       this.currentStep++;
  //     }
  //   } else {
  //     console.log(`${form.name}.invalid`, form.controls);
  //     form.markAllAsTouched();
  //     this._toastr.error(errorMessage, "Action Error!");
  //   }
  // }

  // Navigate to the next step
  calculateNights(checkIn: any, checkOut: any): number {
    if (!checkIn || !checkOut) return 0; // Ensure both dates exist

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkOutDate <= checkInDate) return 0; // Prevent negative nights

    // Calculate total hours difference
    const diffTime = checkOutDate.getTime() - checkInDate.getTime();
    const diffHours = diffTime / (1000 * 60 * 60); // Convert ms to hours

    // Calculate nights based on 24-hour rule
    const nights = Math.ceil(diffHours / 24);

    return nights;
  }

  step4roomsData: any[] = [];
  totalPaxStep4: any = '';
  numberOfRoomsStep4: any = '';
  nightsStep4: any = '';
  RoomChargepPerNight: any = '';
  TotalRoomCharge: any = '';
  NumberOfBreakfast: any = '';
  TotalAllowanceFromBreakfast: any = '';

  NumberOfDinner: any = '';
  TotalAllowanceFromDinner: any = '';

  RequestingPortStep4: any = '';
  AllowancesForBreakfastRate: any = '';
  AllowancesForDinnerRate: any = '';
  NumberOfPax: any = '';
  TotalallowanceforBreakfast: any = '';
  TotalallowanceforDinner: any = '';

  nextStep(targetStep: number) {
    // console.log("Target step:", targetStep);

    if (targetStep > this.currentStep) {
      // Moving forward
      for (let step = this.currentStep; step < targetStep; step++) {
        switch (step) {
          case 0:
            // console.log("Validating Flight Details...");
            if (!this.flightDetailsForm.valid) {
              this.flightDetailsForm.markAllAsTouched();
              this._toastr.error("Please fill out all required flight details.", "Validation Error");
              return; // Stop navigation if form is invalid
            } else {
              // console.log("flightDetailsForm>>", this.flightDetailsForm.value);
            }
            break;

          case 1:
            // console.log("Validating Hotel Selection...");
            if (!this.hotelSelectionForm.valid) {
              this.hotelSelectionForm.markAllAsTouched();
              // console.log("data>>", this.hotelSelectionForm.value);
              this._toastr.error("Please select a valid hotel details.", "Validation Error");
              return; // Stop navigation if form is invalid
            } else {
              // console.log("hotelSelectionForm>>", this.hotelSelectionForm.value);

              let checkIN = this.hotelSelectionForm.value.checkInDate;
              let checkOut = this.hotelSelectionForm.value.checkOutDate;
              this.nightsStep4 = this.calculateNights(checkIN, checkOut);
              // console.log("Total Nights:", this.nightsStep4);


              // this.rooms.clear();
              // this.passengerDetailsAndAllowances.value.rooms.forEach((item:any) => {
              //   const roomForm = this.createRoom();
              //   roomForm.patchValue({
              //     breakfast: this.gettingHotelData.breakfast_rate,
              //     dinner: this.gettingHotelData.dinner_rate,
              //   });
              //   this.rooms.push(roomForm); 
              // });
              const selectedPortId = this.flightDetailsForm.get('requestingPort')?.value;
              this.RequestingPortStep4 = this.getAllPortsData.find(port => port.portid == selectedPortId)
              const selectedHotelId = this.hotelSelectionForm.get('hotel')?.value;
              this.gettingHotelData = this.getHotelsData.find(hotel => hotel.hotel_id == selectedHotelId);
              // console.log("hello>>",this.gettingHotelData);
              if (this.addEditReservationHeading == "Add") {
                let patchValueData = this.passengerDetailsAndAllowances.value.rooms;
                // console.log("patchValueData",patchValueData);

                patchValueData = patchValueData.map((item: any) => ({
                  ...item,
                  breakfast: this.gettingHotelData.breakfast_rate || 0,  // Static value for all
                  dinner: this.gettingHotelData.dinner_rate || 0,      // Static value for all
                }));

                this.populateRooms(patchValueData)
              }


            }
            break;

          case 2:
            // console.log("Validating Passenger Details and Allowances...");
            if (!this.passengerDetailsAndAllowances.valid) {
              this.passengerDetailsAndAllowances.markAllAsTouched();
              console.log("controls", this.passengerDetailsAndAllowances.controls);
              // this._toastr.error("Rate, Room, Pax are only numbers allowed.", "Validation Error");
              // this._toastr.error("The following fields are required: Rate, Room, Pax, and Customer Name.", "Validation Error");
              // this._toastr.error("Both 'No Show' and 'No Show FOC' should not be selectd.", "Validation Error");
              // this._toastr.error("Please complete passenger details and allowances.", "Validation Error");

              let errors: string[] = [];

              const roomsArray = this.passengerDetailsAndAllowances.get('rooms') as FormArray;

              roomsArray.controls.forEach((roomGroup: AbstractControl, index: number) => {
                const rate = roomGroup.get('rate');
                const room = roomGroup.get('room');
                const pax = roomGroup.get('pax');
                const customername = roomGroup.get('customername');
                const noShow = roomGroup.get('no_show');
                const noShowFOC = roomGroup.get('no_show_foc');

                if (rate?.invalid) {
                  errors.push(`Room ${index + 1}: Rate should be a number.`);
                }

                if (room?.invalid) {
                  errors.push(`Room ${index + 1}: Room should be a number.`);
                }
                if (pax?.invalid) {
                  errors.push(`Room ${index + 1}: Pax should be a number.`);
                }
                if (customername?.invalid) {
                  errors.push(`Room ${index + 1}: Customer Name is required.`);
                }
                if (noShow?.value && noShowFOC?.value) {
                  errors.push(`Room ${index + 1}: Both 'No Show' and 'No Show FOC' should not be selected.`);
                }
              });


              if (errors.length > 0) {
                this._toastr.error(errors.join('<br/>'), "Validation Error", { enableHtml: true });
                return;
              }

              // Stop navigation if form is invalid
            } else {
              this.allFormValidData = { ...this.flightDetailsForm.value, ...this.hotelSelectionForm.value, ...this.passengerDetailsAndAllowances.value }
              // console.log(this.passengerDetailsAndAllowances.value.room);
              // this.step4roomsData = this.step4roomsData.map(item => ({
              //   ...item,
              //   breakfast: this.gettingHotelData.breakfast_rate || 0,  // Static value for all
              //   dinner: this.gettingHotelData.breakfast_rate || 0,      // Static value for all
              // }));



              this.step4roomsData = this.passengerDetailsAndAllowances.value.rooms;
              console.log("pData>>>", this.step4roomsData);
              this.totalPaxStep4 = this.step4roomsData.reduce((sum, item) => sum + Number(item.pax), 0);

              this.numberOfRoomsStep4 = this.step4roomsData.reduce((sum, item) => sum + Number(item.room), 0);

              // this.RoomChargepPerNight = this.step4roomsData.map(item => item.rate).join(',');//old
              this.RoomChargepPerNight = this.step4roomsData.map(item => item.no_show_foc ? "0" : item.rate).join(',');

              // this.TotalRoomCharge = this.step4roomsData.reduce((sum, item) => {
              //   return sum + (Number(item.rate) * Number(item.room));
              // }, 0);
              this.TotalRoomCharge = this.step4roomsData.reduce((sum, item) => {
                if (item.no_show_foc) {
                  return sum
                }
                return sum + Number(item.rate) * Number(item.room);
              }, 0);

              // Calculate the total breakfast
              this.NumberOfBreakfast = this.step4roomsData.reduce((sum, item) => sum + Number(item.breakfast), 0);

              this.TotalAllowanceFromBreakfast = (this.NumberOfBreakfast * this.gettingHotelData.breakfast_rate);

              this.NumberOfDinner = this.step4roomsData.reduce((sum, item) => sum + Number(item.dinner), 0);

              this.TotalAllowanceFromDinner = (this.NumberOfDinner * this.gettingHotelData.dinner_rate);

              const selectedPortId = this.flightDetailsForm.get('requestingPort')?.value;
              this.RequestingPortStep4 = this.getAllPortsData.find(port => port.portid == selectedPortId)

              // new_Allowances_code
              // this.AllowancesForBreakfastRate = this.step4roomsData.map(item => item.breakfast).join(',');//old
              this.AllowancesForBreakfastRate = this.step4roomsData.map(item => item.no_show_foc ? "0" : item.breakfast).join(',');

              // this.AllowancesForDinnerRate = this.step4roomsData.map(item => item.dinner).join(',');//old
              this.AllowancesForDinnerRate = this.step4roomsData.map(item => item.no_show_foc ? "0" : item.dinner).join(',');
              this.NumberOfPax = this.step4roomsData.reduce((sum, item) => sum + Number(item.pax), 0);

              // this.TotalallowanceforBreakfast = 2*50+4*70
              // this.TotalallowanceforBreakfast = this.step4roomsData.reduce((sum, item) => {
              //   return sum + (Number(item.pax) * Number(item.breakfast));
              // }, 0);
              this.TotalallowanceforBreakfast = this.step4roomsData.reduce((sum, item) => {
                if (item.no_show_foc) {
                  return sum
                }
                return sum + Number(item.pax) * Number(item.breakfast);
              }, 0);

              //   this.TotalallowanceforDinner = this.step4roomsData.reduce((sum, item) => {
              //     return sum + (Number(item.pax) * Number(item.dinner));
              //   }, 0);
              // }

              this.TotalallowanceforDinner = this.step4roomsData.reduce((sum, item) => {
                if (item.no_show_foc) {
                  return sum
                }
                return sum + Number(item.pax) * Number(item.dinner);
              }, 0);
            }

            break;

          default:
            break;
        }
      }
      this.currentStep = targetStep;
      // console.log("Moved to step:", this.currentStep);
    } else if (targetStep < this.currentStep) {
      // Moving backward
      this.currentStep = targetStep;
      // console.log("Moved back to step:", this.currentStep);
    }
  }


  // Navigate to the previous step
  prevStep() {
    if (this.currentStep > 0) {
      this.currentStep--;
      // console.log(`Navigated to step ${this.currentStep}: ${this.steps[this.currentStep]}`);
    }
  }

  addEditReservationHeading: string = ""
  openVerticallyCenteredSec(newaccount: TemplateRef<any>) {

    this.addEditReservationHeading = "Add";
    this.modalService.open(newaccount, { centered: true, size: 'xl custom-modal ' });
  }

  resetAddReservationAllForms() {
    this.flightDetailsForm.reset();
    this.hotelSelectionForm.reset();
    this.passengerDetailsAndAllowances.reset();
    this.notesValue = '';
    this.commissionValue = '';
    // const rooms = this.passengerDetailsAndAllowances.get('rooms') as FormArray;
    // rooms.clear();
    const rooms = this.passengerDetailsAndAllowances.get('rooms') as FormArray;

    if (rooms.length > 0) {
      // Reset the value of the 0th index (clear its data)
      rooms.at(0).reset();

      // Remove all other elements
      while (rooms.length > 1) {
        rooms.removeAt(1); // Always remove the second element (index 1)
      }
    }


    this.currentStep = 0;
    this._toastr.warning('All fields have been cleared. Please start filling the details again!', 'Notice');
  }

  notesValue: string = '';
  isAddReservationSaving: boolean = false;
  allFormValidData: any = {};
  isAddReservationCompleted: boolean = false;
  addedReservationId: number = 0;
  handleAddReservation() {
    if (this.flightDetailsForm.valid && this.hotelSelectionForm.valid && this.passengerDetailsAndAllowances.valid) {
      this.isAddReservationSaving = true;
      const allFormValidData = { ...this.flightDetailsForm.value, ...this.hotelSelectionForm.value }

      this.allFormValidData = allFormValidData;
      // console.log("allFormValidData", allFormValidData);


      const data = {
        "agentname": allFormValidData.agentName,
        "port": allFormValidData.requestingPort,
        "reqdate": allFormValidData.requestReceived,
        "reqairline": allFormValidData.requestingAirline,
        "flightno": allFormValidData.flightNumber,
        "disruptiondate": allFormValidData.disruptionDate,
        "check_in_date": allFormValidData.checkInDate,
        "check_out_date": allFormValidData.checkOutDate,
        "hotelid": +allFormValidData.hotel,
        "commission": allFormValidData.commission,

        "notes": this.notesValue || "",
        "createdby": this.localData.userid,
        "passengerinfo": this.passengerDetailsAndAllowances.value.rooms
      }

      this._reservationService.reservationCreate(data).subscribe({
        next: (res) => {
          if (res) {
            this.isAddReservationSaving = false;
            this.isAddReservationCompleted = true;
            this.addedReservationId = res.data[0].insertId;
            // console.log("find_id ", res.data[0].insertId);
            this._toastr.success(res.message, 'Success');
            const data = {
              "port": "",
              "reservationdate": "",
              "hotelid": "",
              "airline": "",
              "reservationno": "",
              "limit": +this.limit_user_list,
              "start": (this.currentPage - 1) * this.limit_user_list,
              "end": this.currentPage * this.limit_user_list,
            }
            this.getAllReservation(data);
          } else {
            this.isAddReservationSaving = false;
            this._toastr.error(res.message, 'Error!');
          }
        },
        error: (err) => {
          this.isAddReservationSaving = false;
          console.error('users failed', err);
          this._toastr.error(err.message, 'Error!');
        }
      });

    } else {
      this.flightDetailsForm.markAllAsTouched();
      this.hotelSelectionForm.markAllAsTouched();
      this.passengerDetailsAndAllowances.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }

  addReservationFinalize() {
    const data = {
      "reservationid": this.addedReservationId,
      "status": "Finalize"
    }
    this._reservationService.reservationUpdateStatus(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          const data = {
            "port": "",
            "reservationdate": "",
            "hotelid": "",
            "airline": "",
            "reservationno": "",
            "limit": +this.limit_user_list,
            "start": (this.currentPage - 1) * this.limit_user_list,
            "end": this.currentPage * this.limit_user_list,
          }
          this.getAllReservation(data);
        } else {
          // this.isHotelAvailabilitySaving = false;
          this._toastr.error('Error: Unable to update reservation status', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        // this.isHotelAvailabilitySaving = false;
        this._toastr.error('Error: Unable to update reservation status', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  EditReservationFinalize() {
    const data = {
      "reservationid": this.editReservationData.reservationid,
      "status": "Finalize"
    }
    this._reservationService.reservationUpdateStatus(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          const data = {
            "port": "",
            "reservationdate": "",
            "hotelid": "",
            "airline": "",
            "reservationno": "",
            "limit": +this.limit_user_list,
            "start": (this.currentPage - 1) * this.limit_user_list,
            "end": this.currentPage * this.limit_user_list,
          }
          this.getAllReservation(data);
        } else {
          // this.isHotelAvailabilitySaving = false;
          this._toastr.error('Error: Unable to update reservation status', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        // this.isHotelAvailabilitySaving = false;
        this._toastr.error('Error: Unable to update reservation status', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  reservationUpdateStatusFun(data: any) {
    this._reservationService.reservationUpdateStatus(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          const data = {
            "port": "",
            "reservationdate": "",
            "hotelid": "",
            "airline": "",
            "reservationno": "",
            "limit": +this.limit_user_list,
            "start": (this.currentPage - 1) * this.limit_user_list,
            "end": this.currentPage * this.limit_user_list,
          }
          this.getAllReservation(data);
          this.modalService.dismissAll();
        } else {
          // this.isHotelAvailabilitySaving = false;
          this._toastr.error('Error: Unable to update reservation status', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        // this.isHotelAvailabilitySaving = false;
        this._toastr.error('Error: Unable to update reservation status', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  addReservationCopy() {
    const data = {
      "reservationid": this.addedReservationId,
    }
    this.reservationCopyFun(data);
  }

  async reservationCopyFun(data: any) {
    this._reservationService.reservationCopy(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          const data = {
            "port": "",
            "reservationdate": "",
            "hotelid": "",
            "airline": "",
            "reservationno": "",
            "limit": +this.limit_user_list,
            "start": (this.currentPage - 1) * this.limit_user_list,
            "end": this.currentPage * this.limit_user_list,
          }
          this.getAllReservation(data)
          this.modalService.dismissAll();
          // this.isHotelAvailabilitySaving = false;
        } else {
          // this.isHotelAvailabilitySaving = false;
          this._toastr.error('Error: Unable to update reservation status', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        // this.isHotelAvailabilitySaving = false;
        this._toastr.error('Error: Unable to update reservation status', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  getHotelsData: any[] = [];
  async getActiveHotels() {
    try {
      let data = {}
      const res = await this._hotelService.getActiveHotels(data).toPromise();
      if (res) {
        this.getHotelsData = res.data;
      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  getHotelsDataByPort: any[] = [];
  async getHotelsByPort() {

    try {
      let data = {
        port: this.flightDetailsForm.get("requestingPort")?.value
      }
      const res = await this._hotelService.getActiveHotels(data).toPromise();
      if (res) {
        this.getHotelsDataByPort = res.data;
      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  gettingHotelData: any = {}
  gettingHotelDataOnChange(event: any) {
    let id = event.target.value;
    // console.log("data hotel",id);
    this.gettingHotelData = this.getHotelsData.find(hotel => hotel.hotel_id == id);
    // console.log("founded hotel Data", this.gettingHotelData);

  }


  getAllPortsData: any[] = [];
  async getAllPorts() {
    try {
      const res = await this._reservationService.portList().toPromise();
      if (res) {
        this.getAllPortsData = res.data;
      } else {
        console.error("Error: Unable to fetch portList. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  getAllAirlinesData: any[] = [];
  async getAllAirlines() {
    try {
      const res = await this._reservationService.airlineList().toPromise();
      if (res) {
        this.getAllAirlinesData = res.data;
      } else {
        console.error("Error: Unable to fetch getAllAirlines. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }
  isShimmer: boolean = false;
  getAllReservationData: any[] = [];
  async getAllReservation(data: any) {
    this.isShimmer = true;
    try {
      const res = await this._reservationService.reservationList(data).toPromise();
      if (res) {
        this.getAllReservationData = res.data;

        this.totalRecords = res.totalcount;
        this.totalPages = Math.ceil(this.totalRecords / this.limit_user_list);
        this.pages = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        this.updatePages();
        this.isShimmer = false;
      } else {
        // this.getAllReservationData = res.data;
        // this.totalRecords = res.usercount;
        this.isShimmer = false;
        this._toastr.error(res.message, 'Error');
        console.error('Error: Unable to fetch the reservation list. Response:', res);
      }
    } catch (err) {
      this.isShimmer = false;
      // this._toastr.error('An error occurred while fetching the reservation list', 'Error');
      console.error('An error occurred', err);
    }
  }

  handleListFilters() {
    // console.log('Selected Port:', this.selectedPort);
    // console.log('Selected Date:', this.selectedDate);
    // console.log('Selected Hotel:', this.selectedHotel);
    // console.log('Selected Airline:', this.selectedAirline);
    // console.log('Reservation Number:', this.selectedReservationNumber);
    const data = {
      "port": +this.selectedPort || "",
      "reservationdate": this.selectedDate || "",
      "hotelid": +this.selectedHotel || "",
      "airline": +this.selectedAirline || "",
      "reservationno": this.selectedReservationNumber || "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }

  handleListFiltersReset() {
    this.selectedPort = null;
    this.selectedDate = "";
    this.selectedHotel = null;
    this.selectedAirline = null;
    this.selectedReservationNumber = "";
    const data = {
      "port": "",
      "reservationdate": "",
      "hotelid": "",
      "airline": "",
      "reservationno": "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }

  editReservationData: any = {};
  email_for_send_mail: any = '';
  handleEditReservation(newaccount: TemplateRef<any>, data: any) {

    this.addEditReservationHeading = "Edit";
    this.editReservationData = data;//for_reservation_id_to_edit_save_btn
    // console.log("edit_data", data);
    const payLoadData = {
      "reservationid": data.reservationid
    }

    this._reservationService.getReservationById(payLoadData).subscribe({
      next: (res) => {
        if (res && res.success) {
          const FlightDataAndHotelData = res.reservation[0];
          this.email_for_send_mail = FlightDataAndHotelData.email;
          //step 1
          this.flightDetailsForm.patchValue({
            agentName: FlightDataAndHotelData.agent_name || 'N/A',
            requestingPort: FlightDataAndHotelData.requesting_port || 'N/A',
            // requestReceived: FlightDataAndHotelData.requesting_date || 'N/A',
            // requestReceived: FlightDataAndHotelData.requesting_date ? new Date(FlightDataAndHotelData.requesting_date).toISOString().split('T')[0] : null,
            requestReceived: FlightDataAndHotelData.requesting_date
              ? new Date(FlightDataAndHotelData.requesting_date).toISOString().slice(0, 16)
              : null,

            requestingAirline: FlightDataAndHotelData.airlineid || 'N/A',
            flightNumber: FlightDataAndHotelData.flight_no || 'N/A',
            disruptionDate: FlightDataAndHotelData.disruption_date ? this.datePipe.transform(FlightDataAndHotelData.disruption_date, 'yyyy-MM-dd') : "N/A",
          })

          this.getHotelsByPort();//for_getting_hotel_dala
          this.gettingHotelData = this.getHotelsData.find(hotel => hotel.hotel_id == FlightDataAndHotelData.hotel_id);
          // step 2
          this.hotelSelectionForm.patchValue({
            checkInDate: FlightDataAndHotelData.check_in_date ? new Date(FlightDataAndHotelData.check_in_date).toISOString().slice(0, 16)
              : null,
            checkOutDate: FlightDataAndHotelData.check_out_date ? new Date(FlightDataAndHotelData.check_out_date).toISOString().slice(0, 16)
              : null,
            hotel: FlightDataAndHotelData.hotel_id,
            commission: FlightDataAndHotelData.commission,
          })
          this.commissionValue = FlightDataAndHotelData.commission + "%";


          // step3
          const PassengerDataAndRoomData: any[] = res.reservationdetails;
          this.populateRooms(PassengerDataAndRoomData);

          //  step 4
          this.notesValue = FlightDataAndHotelData.notes;

        } else {

          this._toastr.error('Error: Unable to update reservation status', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {

        this._toastr.error('Error: Unable to update reservation status', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });


    //step 4
    // this.notesValue = data.notes;
    // this.gettingHotelData.hotel_name = data.hotel_name;
    // this.allFormValidData = data;

    this.modalService.open(newaccount, { centered: true, size: 'xl custom-modal ' });
  }

  // Function to populate the FormArray with backend data
  populateRooms(data: any[]): void {
    // console.log("123", data);
    this.rooms.clear(); // Clear any existing controls in the FormArray

    data.forEach((item) => {
      const roomForm = this.createRoom(); // Create a new FormGroup for each room

      // Patch values into the FormGroup
      roomForm.patchValue({
        rate: item.rate || 0, // Use `|| ''` to provide a fallback in case the key is missing
        room: item.room || 0,
        pax: item.pax || 0,
        customername: item.customername || item.customer_name || '', // Handle renamed key
        breakfast: item.breakfast || this.gettingHotelData.breakfast_rate || 0,
        dinner: item.dinner || 0,
        no_show: item.no_show?.data?.[0] || false,
        no_show_foc: item.no_show_foc?.data?.[0] || false,
        reservationdetailsid: item.reservationdetailsid || 0
      });

      this.rooms.push(roomForm); // Add the FormGroup to the FormArray
    });
  }


  // edit_reservation
  handleEditReservationSaveBtn() {
    const data = {
      "reservationid": this.editReservationData.reservationid,
      "agentname": this.flightDetailsForm.get("agentName")?.value || "N/A",
      "port": this.flightDetailsForm.get("requestingPort")?.value || "N/A",
      "reqdate": this.flightDetailsForm.get("requestReceived")?.value || "N/A",
      "reqairline": this.flightDetailsForm.get("requestingAirline")?.value || "N/A",
      "flightno": this.flightDetailsForm.get("flightNumber")?.value || "N/A",
      "disruptiondate": this.flightDetailsForm.get("disruptionDate")?.value || "N/A",
      "check_in_date": this.hotelSelectionForm.get("checkInDate")?.value || "N/A",
      "check_out_date": this.hotelSelectionForm.get("checkOutDate")?.value || "N/A",
      "hotelid": this.hotelSelectionForm.get("hotel")?.value || "N/A",
      "commission": this.hotelSelectionForm.get("commission")?.value || "N/A",
      "notes": this.notesValue || "N/A",
      "createdby": this.localData.userid || "N/A",

      "passengerinfo": this.rooms.value || [],
    }

    this._reservationService.reservationEdit(data).subscribe({
      next: (res) => {
        if (res) {
          this._toastr.success(res.message, 'Success');
          const data = {
            "limit": +this.limit_user_list,
            "start": (this.currentPage - 1) * this.limit_user_list,
            "end": this.currentPage * this.limit_user_list,
          }
          this.getAllReservation(data)
        } else {
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  modalReferenceForClose: any;
  handleSendMail(conformationBox: TemplateRef<any>, heading: string) {
    this.headingConformationBox = heading;
    this.modalReferenceForClose = this.modalService.open(conformationBox, { centered: true, size: 'md' });
  }
  isSendMail: boolean = false;
  handleSendMailSave() {
    const dataPdf = {
      "reservationid": this.editReservationData.reservationid,
    }
    this.downloadpdfFun(dataPdf);
    const data = {
      "reservationid": this.editReservationData.reservationid,
      "email": this.email_for_send_mail || ""
    }
    this.isSendMail = true;

    this._reservationService.sendpdf(data).subscribe({
      next: (res) => {
        if (res) {
          this.isSendMail = false;
          this._toastr.success(res.message, 'Success');
          this.modalReferenceForClose.close();
        } else {
          this.isSendMail = false;
          this._toastr.error('Error: Unable to update reservation downloadpdf', 'Error');
          this._toastr.error(res.message, 'Error!');
        }
      },
      error: (err) => {
        this.isSendMail = false;
        this._toastr.error('Error: Unable to update reservation downloadpdf', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  editNotesData: any = {};
  openReservationNotesEdit(reservation_notes: TemplateRef<any>, data: any) {
    this.editNotesData = data;
    this.modalService.open(reservation_notes, { centered: true, size: 'lg' });
  }


  isHotelEditNoteSaving: boolean = false;
  handleEditNoteSave() {
    if (this.reservationEditNotesMsgForm.valid) {
      this.isHotelEditNoteSaving = true;
      const data = {
        "reservationid": this.editNotesData.reservationid || 'N/A',
        "notes": this.reservationEditNotesMsgForm.get("message")?.value || 'N/A',
      }
      this._reservationService.reservationUpdateNotes(data).subscribe({
        next: (res) => {
          if (res) {
            this.isHotelEditNoteSaving = false;
            this._toastr.success(res.message, 'Success');
            this.modalService.dismissAll();
            this.reservationEditNotesMsgForm.reset();
            const data = {
              "limit": +this.limit_user_list,
              "start": (this.currentPage - 1) * this.limit_user_list,
              "end": this.currentPage * this.limit_user_list,
            }
            this.getAllReservation(data)
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
      this.reservationEditNotesMsgForm.markAllAsTouched();
      this._toastr.error("Something went wrong", "Action Error!");
    }
  }


  headingConformationBox: string = '';
  makeACopyData: any = {};
  makeACopy(conformationBox: TemplateRef<any>, data: any, heading: string) {
    this.makeACopyData = data;
    this.headingConformationBox = heading;
    // this.modalReference = this.modalService.open(conformationBox, { centered: true, size: 'md' });
    this.modalService.open(conformationBox, { centered: true, size: 'md' });
  }
  handleMakeACopySave() {
    const dataPayload = {
      "reservationid": this.makeACopyData.reservationid,
    }
    this.reservationCopyFun(dataPayload);
  }

  actionCancelData: any = {};
  actionCancel(conformationBox: TemplateRef<any>, data: any, heading: string) {
    this.headingConformationBox = heading;
    this.actionCancelData = data;
    this.modalService.open(conformationBox, { centered: true, size: 'md' });

  }

  handleCancelSave() {
    const dataStatus = {
      "reservationid": this.actionCancelData.reservationid,
      "status": "Cancel"
    }
    this.reservationUpdateStatusFun(dataStatus);
  }

  handleReopenSave() {
    const dataStatus = {
      "reservationid": this.actionCancelData.reservationid,
      "status": "Open"
    }
    this.reservationUpdateStatusFun(dataStatus);
  }


  // reservationIdForPdfName: any = '';
  editDownloadPdf(data: any) {
    const dataPdf = {
      "reservationid": data.reservationid,
    }
    this.downloadpdfFun(dataPdf);
  }
  isDownloadPdf: boolean = false;
  downloadpdfFun(data: any) {
    const reservationId = data.reservationid; // Store locally
    this.isDownloadPdf = true;
    this._reservationService.downloadpdf(data).subscribe({
      next: (res) => {
        if (res && res.path && res.message) {
          this.jsPDFLibrary(res.path, reservationId); // Pass reservationId separately
          this._toastr.success(res.message, 'Success');
        } else {
          this.isDownloadPdf = false;
          this._toastr.error("PDF path is missing", 'Error!');
        }
      },
      error: (err) => {
        this.isDownloadPdf = false;
        this._toastr.error('Error: Unable to update reservation downloadpdf', 'Error');
        this._toastr.error(err.message, 'Error!');
      }
    });
  }

  downloadAsPdf() {
    const dataPdf = {
      "reservationid": this.addedReservationId,
    }
    this.downloadpdfFun(dataPdf);
  }
  EditDownloadAsPdf() {
    const dataPdf = {
      "reservationid": this.editReservationData.reservationid,
    }
    this.downloadpdfFun(dataPdf);
  }

  downloadAndOpenFile(pdfPath: string) {
    const filename = pdfPath.split('/').pop() || 'download.pdf';

    this._http.get(pdfPath, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        this._toastr.error('Error downloading PDF', 'Error!');
        console.error('Download error:', err);
      }
    });
  }
  conformationBoxCloseForAction: boolean = false;
  async jsPDFLibrary(htmlData: any, reservationId: string) {
    try {
      const htmlContent = document.createElement('div');
      htmlContent.innerHTML = htmlData;
      // Clone the HTML before passing it to html2pdf
      const htmlClone = htmlContent.cloneNode(true) as HTMLElement;

      const options = {
        filename: `${reservationId}.pdf`,
        margin: 10,
        html2canvas: { scale: 4 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      // Use the cloned HTML instead of the original
      const pdfBlob: Blob = await html2pdf().from(htmlClone).set(options).outputPdf('blob');

      // Save the PDF locally
      html2pdf().from(htmlClone).set(options).save();

      const formData = new FormData();
      formData.append('file', pdfBlob, `${reservationId}.pdf`);

      const response = await fetch('https://apiindelible.itsabacus.net/reservation/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      this.isDownloadPdf = false;
      if (this.conformationBoxCloseForAction === true) {
        this.modalService.dismissAll();
      } else {
        this.conformationBoxCloseForAction = false
      }
      this._toastr.success('Upload Success', 'Success!');
      // console.log('Upload Success:', data);
    } catch (error) {
      this.isDownloadPdf = false;
      if (this.conformationBoxCloseForAction === true) {
        this.modalService.dismissAll();
      } else {
        this.conformationBoxCloseForAction = false
      }
      console.error('PDF Generation/Upload Error:', error);
      this._toastr.error('Error during PDF processing', 'Error!');
    }
  }

  actionReadyToBillData: any = {};
  actionReadyToBill(conformationBox: TemplateRef<any>, data: any, heading: string) {
    this.actionReadyToBillData = data;
    this.headingConformationBox = heading;
    this.modalService.open(conformationBox, { centered: true, size: 'md' });
    // const dataStatus = {
    //   "reservationid": data.reservationid,
    //   "status": "Billing"
    // }
    // this.reservationUpdateStatusFun(dataStatus);

  }
  handleReadyToBillSave() {
    const dataStatus = {
      "reservationid": this.actionReadyToBillData.reservationid,
      "status": "Billing"
    }
    this.reservationUpdateStatusFun(dataStatus);
  }

  getBadgeClass(status: string): string {
    const statusClasses: { [key: string]: string } = {
      'Billing': 'badge-warning',  // Changed color to make it more visible
      'Finalize': 'badge-primary',
      'Open': 'badge-success',
      'Cancel': 'badge-danger',
      'Draft': 'badge-secondary',
    };

    return statusClasses[status] || 'badge-light';  // Default class if status is unknown
  }

  // upload_invoice_start
  selectedOrderFiles: File[] = [];
  errorMessageForOrderFile: string = '';
  allowedFileTypesForOrder = ['pdf', 'jpg', 'png', 'toc', 'doc', 'tml', 'opt', 'txt', 'jpeg', 'docx', 'xlsx'];

  newFormDataForOrderFileUploading: FormData = new FormData();
  uploadInvoiceReservationData: any = {};
  handleOderFileUpload(invoiceFileUploadBox: TemplateRef<any>, data: any) {

    // this.newFormDataForOrderFileUploading.append('reservationid', data.reservationid);
    this.uploadInvoiceReservationData = data;

    this.modalService.open(invoiceFileUploadBox, { centered: true, size: 'lg' });
  }

  // onChangeFile(event: Event) {
  //   this.errorMessageForOrderFile = '';
  //   const input = event.target as HTMLInputElement;
  //   if (input?.files) {
  //     const files = Array.from(input.files);
  //     const validFiles: File[] = [];
  //     const invalidFiles: string[] = [];
  //     const sizeLimitMB = 30; // Size limit in MB
  //     const sizeLimitBytes = sizeLimitMB * 1024 * 1024;

  //     files.forEach((file) => {
  //       const fileExtension = file.name.split('.').pop()?.toLowerCase();
  //       const fileSize = file.size;

  //       // Validate file type and size
  //       if (
  //         fileExtension &&
  //         this.allowedFileTypesForOrder.includes(fileExtension) &&
  //         fileSize <= sizeLimitBytes
  //       ) {
  //         // Check if the file is already selected
  //         const alreadySelected = this.selectedOrderFiles.some(
  //           (selectedFile) => selectedFile.name === file.name && selectedFile.size === file.size
  //         );
  //         if (!alreadySelected) {
  //           validFiles.push(file);
  //           this.newFormDataForOrderFileUploading.append('file', file, file.name); // Add file to FormData
  //         }
  //       } else {
  //         invalidFiles.push(
  //           `${file.name} ${fileSize > sizeLimitBytes ? `(exceeds ${sizeLimitMB}MB)` : '(invalid type)'
  //           }`
  //         );
  //       }
  //     });

  //     // Show error for invalid files
  //     if (invalidFiles.length > 0) {
  //       this.errorMessageForOrderFile = `Invalid files: ${invalidFiles.join(
  //         ', '
  //       )}. Allowed file types: ${this.allowedFileTypesForOrder.join(
  //         ', '
  //       )}, and each file should be up to ${sizeLimitMB}MB.`;
  //     }

  //     // Append the new valid files to the existing selectedOrderFiles
  //     this.selectedOrderFiles = [...this.selectedOrderFiles, ...validFiles];
  //     if (this.selectedOrderFiles.length > 0) {
  //       this.invoiceFileUpload.get('file')?.setValue(this.selectedOrderFiles);
  //     } else {
  //       this.invoiceFileUpload.get('file')?.setValue(null);
  //     }
  //   }
  // }

  onChangeFile(event: Event) {
    this.errorMessageForOrderFile = '';
    const input = event.target as HTMLInputElement;

    if (input?.files && input.files.length > 0) {
      const file = input.files[0]; // Only take the first file
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const fileSize = file.size;
      const sizeLimitMB = 30; // Size limit in MB
      const sizeLimitBytes = sizeLimitMB * 1024 * 1024;

      // Validate file type and size
      if (
        fileExtension &&
        this.allowedFileTypesForOrder.includes(fileExtension) &&
        fileSize <= sizeLimitBytes
      ) {
        // Reset previous selection
        this.selectedOrderFiles = [file];
        this.newFormDataForOrderFileUploading = new FormData();

        // Append only the new file
        this.newFormDataForOrderFileUploading.append('reservationid', this.uploadInvoiceReservationData.reservationid);
        this.newFormDataForOrderFileUploading.append('userid', this.localData.userid);
        this.newFormDataForOrderFileUploading.append('file', file, file.name);

        this.invoiceFileUpload.get('file')?.setValue(this.selectedOrderFiles);
      } else {
        this.errorMessageForOrderFile = `Invalid file: ${file.name} ${fileSize > sizeLimitBytes ? `(exceeds ${sizeLimitMB}MB)` : '(invalid type)'
          }. Allowed file types: ${this.allowedFileTypesForOrder.join(', ')}, and max size ${sizeLimitMB}MB.`;

        this.invoiceFileUpload.get('file')?.setValue(null);
        input.value = ''; // Clear the file input
      }
    }
  }



  // Handle form submission
  isInvoiceSave: boolean = false;
  async handleUploadInvoiceSave() {
    if (this.invoiceFileUpload.valid) {
      this.isInvoiceSave = true;  // Start "Save" button loader
      //call api start
      try {
        const res = await this._reservationService.reservationFileUpload(this.newFormDataForOrderFileUploading).toPromise();
        if (res && res.message) {
          this._toastr.success(res.message, 'Success');
          this.isInvoiceSave = false;  // Stop "Save" button loader
          // Clear selected files after a successful upload
          this.selectedOrderFiles = [];
          this.newFormDataForOrderFileUploading = new FormData();
          // Reset the file input field
          const fileInput = document.getElementById('orders-room-item-file-uploading') as HTMLInputElement;
          if (fileInput) {
            fileInput.value = ''; // Clear the file input
          }
          this.modalService.dismissAll();
        } else {
          this._toastr.error(res.message || 'An error occurred while uploading.', 'Error!');
          this.newFormDataForOrderFileUploading = new FormData();
          this.isInvoiceSave = false;  // Stop "Save" button loader 
        }
      } catch (err: any) {
        this._toastr.error(err.message || 'An error occurred.', 'Error!');
        this.newFormDataForOrderFileUploading = new FormData();
        this.isInvoiceSave = false;  // Stop "Save" button loader
      }
      //call api end

    } else {
      this.errorMessageForOrderFile = 'Please select valid files before uploading.';
      this._toastr.error(this.errorMessageForOrderFile);
    }
  }



  resetinvoiceFileUpload() {
    this.invoiceFileUpload.reset();
    this.errorMessageForOrderFile = '';
    this.selectedOrderFiles = [];
    this.newFormDataForOrderFileUploading = new FormData();
    this.invoiceFileUpload.markAllAsTouched();
  }


  // upload_invoice_end



  finish() {
    console.log('Stepper completed!');
  }

  openSelectHotelSec(selectHotel: TemplateRef<any>) {
    this.modalService.open(selectHotel, { centered: true, size: 'xl' });
  }

  // limit pagination for list 
  onLimitChange(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;
    if (selectedValue) {
      this.limit_user_list = selectedValue;
      this.currentPage = 1;
      const data = {
        "port": "",
        "reservationdate": "",
        "hotelid": "",
        "airline": "",
        "reservationno": "",
        "limit": +this.limit_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getAllReservation(data);
    }
  }

  goToPreviousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      const data = {
        "port": "",
        "reservationdate": "",
        "hotelid": "",
        "airline": "",
        "reservationno": "",
        "limit": +this.limit_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getAllReservation(data);
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
    const data = {
      "port": "",
      "reservationdate": "",
      "hotelid": "",
      "airline": "",
      "reservationno": "",
      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }

  goToNextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      const data = {
        "port": "",
        "reservationdate": "",
        "hotelid": "",
        "airline": "",
        "reservationno": "",
        "limit": +this.limit_user_list,
        "start": (this.currentPage - 1) * this.limit_user_list,
        "end": this.currentPage * this.limit_user_list,
      };
      this.getAllReservation(data);
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

  listPortChange() {
    const data = {
      "port": +this.selectedPort || "",
      "reservationdate": this.selectedDate || "",
      "hotelid": +this.selectedHotel || "",
      "airline": +this.selectedAirline || "",
      "reservationno": this.selectedReservationNumber || "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }

  listDateChange() {
    const data = {
      "port": +this.selectedPort || "",
      "reservationdate": this.selectedDate || "",
      "hotelid": +this.selectedHotel || "",
      "airline": +this.selectedAirline || "",
      "reservationno": this.selectedReservationNumber || "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }
  listHotelChange() {
    const data = {
      "port": +this.selectedPort || "",
      "reservationdate": this.selectedDate || "",
      "hotelid": +this.selectedHotel || "",
      "airline": +this.selectedAirline || "",
      "reservationno": this.selectedReservationNumber || "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }
  listAirlineChange() {
    const data = {
      "port": +this.selectedPort || "",
      "reservationdate": this.selectedDate || "",
      "hotelid": +this.selectedHotel || "",
      "airline": +this.selectedAirline || "",
      "reservationno": this.selectedReservationNumber || "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }
  listReservationNumberChange(e: any) {
    const data = {
      "port": +this.selectedPort || "",
      "reservationdate": this.selectedDate || "",
      "hotelid": +this.selectedHotel || "",
      "airline": +this.selectedAirline || "",
      "reservationno": e.target.value || "",

      "limit": +this.limit_user_list,
      "start": (this.currentPage - 1) * this.limit_user_list,
      "end": this.currentPage * this.limit_user_list,
    };
    this.getAllReservation(data);
  }


  commissionValue: string = '';
  appendPercentage(event: any) {
    let value = event.target.value.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    this.commissionValue = value ? value + '%' : ''; // Append '%' only if there's a number

    // console.log("input>>", this.hotelSelectionForm.get("commission")?.value);
  }

  actionDownloadPdfData: any = {};
  actionDownloadPdf(conformationBox: TemplateRef<any>, data: any, heading: string) {
    this.headingConformationBox = heading;
    this.actionDownloadPdfData = data;
    this.modalService.open(conformationBox, { centered: true, size: 'md' });
    // console.log("donwload_pdf_data", this.actionDownloadPdfData);
  }

  handleDownloadPdfSave() {
    const dataPdf = {
      "reservationid": this.actionDownloadPdfData.reservationid,
    }
    this.downloadpdfFun(dataPdf);
    this.conformationBoxCloseForAction = true;

  }















}
