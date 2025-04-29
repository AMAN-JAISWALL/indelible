import { Directive, ElementRef, HostListener } from "@angular/core";

@Directive({
  selector: "[appTwoDigitDecimalNumber]",
})
export class TwoDigitDecimalNumberDirective {
  private regex: RegExp = new RegExp(/^\d+(\.\d{0,2})?$/); // Allows up to 2 decimal places
  private specialKeys: string[] = [
    "Backspace",
    "Tab",
    "End",
    "Home",
    "ArrowLeft",
    "ArrowRight",
    "Delete",
  ];

  constructor(private el: ElementRef) {}

  @HostListener("keydown", ["$event"])
  onKeyDown(event: KeyboardEvent) {
    // Allow special keys
    if (this.specialKeys.includes(event.key)) {
      return;
    }

    // Allow only numbers and one decimal point
    const currentValue: string = this.el.nativeElement.value;
    const position = this.el.nativeElement.selectionStart;
    const newValue: string =
      currentValue.slice(0, position) + event.key + currentValue.slice(position);

    if (!this.regex.test(newValue)) {
      event.preventDefault();
    }
  }

  @HostListener("paste", ["$event"])
  onPaste(event: ClipboardEvent) {
    event.preventDefault();
    const pastedText = (event.clipboardData || (window as any).clipboardData).getData("text");
    if (this.regex.test(pastedText)) {
      this.el.nativeElement.value = pastedText;
    }
  }
}
