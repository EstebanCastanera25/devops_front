import { Component, Input, OnInit, DoCheck} from '@angular/core';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.scss'
})
export class SpinnerComponent implements OnInit, DoCheck{
   @Input() mostrarSpinner:boolean=false
 @Input() height:string = "100%";

  localSpinnerDoble:boolean=false

  constructor() { }

  ngOnInit(): void {
  }

  ngDoCheck(): void {
    if(this.localSpinnerDoble!=undefined)
      this.localSpinnerDoble=this.mostrarSpinner
  }
}
