import { Component } from '@angular/core'
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms'

@Component({
  selector: 'app-root',
  template: `
    <p>Heros:</p>
    <form [formGroup]="heroForm" novalidate>
      <div formArrayName="heros">
        <div *ngFor="let hero of heroForm.get('heros').controls; let i = index" [formGroupName]="i">
          <div>
            <label>Name:</label> 
            <input formControlName="name" />
          </div>
          <div>
            <label>Power Level:</label>
            <input formControlName="powerLevel" />
            <div *ngIf="hero.controls.powerLevel.errors?.powerLevelNotANumber" class="validation-error">* Power level must be a number</div>
            <div *ngIf="hero.controls.powerLevel.errors?.powerLevelTooHigh" class="validation-error">* Power level can't be over 9000</div>
            <div *ngIf="hero.controls.powerLevel.errors?.powerLevelTooLow" class="validation-error">* Power level can't be less than 0</div>
          </div>
          <div formArrayName="powers">
            <div *ngFor="let aPower of hero.get('powers').controls; let j = index" [formGroupName]="j">
              <label>Power #{{j}}<input formControlName="power" /></label>
            </div>
          </div>
        </div>
      </div>
    </form>
    <p>Form Value: {{ heroForm.value | json }}</p>
    <p>Form Status: {{ heroForm.status | json }}</p>
  `,
  styles: [`
    .validation-error {
      color: red;
      padding-left: 25px;
    }
  `]
})
export class AppComponent {
  title = 'app';

  heroForm: FormGroup

  heroArray = [
    { name: 'Iron Man', powerLevel: 9001,  powers: [ 'Metal Suit', 'Smart', 'Rich' ] },
    { name: 'Superman', powerLevel: 8,  powers: [ 'Strength', 'Flys', 'Laser Vision' ] }
  ]

  constructor(private fb: FormBuilder) {
    this.createForm()
    console.log(this.heroForm)
  }

  createForm() {
    this.heroForm = this.fb.group({
      heros: this.fb.array([])
    })
    this.setHeros(this.heroArray)
  }

  setHeros(heroArr: Hero[]) {
    const heroFgs = heroArr.map(hero => this.fb.group({
      name: [ hero.name, Validators.required ],
      powerLevel: [ hero.powerLevel, powerLevelValidator() ],
      powers: this.fb.array(this.setPowers(hero.powers))
    }))
    this.heroForm.setControl('heros', this.fb.array(heroFgs))
  }

  setPowers(powers: string[]) {
    return powers.map(power => this.fb.group({
      power: [ power ]
    }))
  }

  log(val: any) {
    console.log(val)
    return false
  }
}

class Hero {
  name: string
  powerLevel: number
  powers: string []
}

export function powerLevelValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} => {
    const returnVal = {'powerLevelForbidden': {value: control.value }}

    if (isNaN(control.value)) {
      return {'powerLevelNotANumber': {value: control.value }}
    } else if (control.value < 0) {
      return {'powerLevelTooLow': {value: control.value}}
    } else if (control.value > 9000) {
      return {'powerLevelTooHigh': {value: control.value}}
    }

    return null
  }
}