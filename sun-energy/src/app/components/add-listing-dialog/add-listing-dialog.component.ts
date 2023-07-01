import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { combineLatestWith } from 'rxjs';
import { Address, AddressResponse } from 'src/app/interfaces/address.interface';
import { Future, FutureResponse } from 'src/app/interfaces/futures.interface';
import { Panel, PanelResponse } from 'src/app/interfaces/panel.interface';
import { AddressService } from 'src/app/services/address.service';
import { FuturesService } from 'src/app/services/futures.service';
import { PanelService } from 'src/app/services/panel.service';

@Component({
  selector: 'app-add-listing-dialog',
  templateUrl: './add-listing-dialog.component.html',
  styleUrls: ['./add-listing-dialog.component.scss'],
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    CommonModule,
  ],
  providers: [FuturesService],
})
export class AddListingDialogComponent implements OnInit {
  panels!: Panel[];
  addresses!: Address[];
  futures!: Future[];
  selectedAddress = '';
  quantityForAddresses: number[] = [];
  selectedQuantity = 0;
  contractRate = 0;
  consumedMonths!: number[];
  maturityDate = 6;

  formGroup: FormGroup = new FormGroup({
    address: new FormControl(this.selectedAddress),
    quantity: new FormControl(this.selectedQuantity, [Validators.required]),
    price: new FormControl(0, [
      Validators.required,
      (control: AbstractControl) => Validators.min(this.contractRate)(control),
      (control: AbstractControl) =>
        Validators.max(this.contractRate * 4)(control),
    ]),
    maturityDate: new FormControl(this.maturityDate),
  });

  get controls() {
    return this.formGroup.controls;
  }

  constructor(
    public dialogRef: MatDialogRef<AddListingDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addressService: AddressService,
    private panelService: PanelService,
    private futuresService: FuturesService
  ) {}

  ngOnInit() {
    this.initData();
  }

  initData() {
    const panel$ = this.panelService.getPanelsForUser();
    const address$ = this.addressService.getAddresses();
    const futures$ = this.futuresService.getUserListedFutures();

    panel$
      .pipe(combineLatestWith(address$, futures$))
      .subscribe(([panelRes, addressRes, futuresRes]) => {
        this.panels = (panelRes as PanelResponse).results;
        this.addresses = (addressRes as AddressResponse).results;
        this.futures = (futuresRes as FutureResponse).results;
        this.initAddressesSelect();
        this.initQuantities();
      });
  }

  initAddressesSelect() {
    this.addresses = this.addresses.filter(
      (address) => address.status == 'Active'
    );
    this.controls['address'].valueChanges.subscribe((value) => {
      const qIndex = this.addresses.findIndex(
        (address) => address.address == value
      );
      this.selectedQuantity = this.quantityForAddresses[qIndex]
        ? this.quantityForAddresses[qIndex]
        : 0;
      this.contractRate = this.addresses[qIndex].rate;
      this.controls['price'].setValue(this.contractRate);
    });
    this.selectedAddress = this.addresses[0].address;
  }

  initQuantities() {
    for (const address of this.addresses) {
      this.computeProducedAddress(address, this.panels);
    }
  }

  computeProducedAddress(address: Address, panels: Panel[]) {
    let produced = 0;
    for (const panel of panels) {
      for (const metric of panel.metrics) {
        produced += panel.addressId == address.id ? Number(metric.produced) : 0;
      }
    }

    let consumed = 0;
    for (const metric of address.consumed!) {
      consumed += metric.newIndex;
    }

    let initialRes = produced - consumed;
    if (initialRes > 0) {
      for (const future of this.futures) {
        initialRes -= address.id == future.addressId ? future.quantity : 0;
      }
      this.quantityForAddresses.push(initialRes);
    }
  }

  listFuture() {
    this.futuresService
      .listFuture({
        quantity: this.selectedQuantity,
        rate: this.controls['price'].value,
        maturityDate: this.maturityDate,
        addressId: this.addresses.find(
          (address) => this.selectedAddress == address.address
        )?.id!,
      })
      .subscribe({
        next: () => {
          this.dialogRef.close({ success: true });
        },
        error: (err) => {
          window.alert(err.message);
        },
      });
  }

  closeDialog() {
    this.dialogRef.close({ success: false });
  }
}
