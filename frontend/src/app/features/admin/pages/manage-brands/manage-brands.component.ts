import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrandService, Brand } from '../../../../core/services/brand.service';

// PrimeNG Imports
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputSwitchModule } from 'primeng/inputswitch';

@Component({
  selector: 'app-manage-brands',
  standalone: true,
  imports: [
    CommonModule, FormsModule, ReactiveFormsModule, 
    TableModule, ButtonModule, DialogModule, InputTextModule, 
    InputTextareaModule, ToastModule, InputSwitchModule
  ],
  providers: [MessageService],
  template: `
    <div class="p-4">
      <p-toast></p-toast>
      <div class="flex justify-content-between align-items-center mb-4">
        <h2 class="m-0 text-2xl font-semibold">Gestión de Marcas</h2>
        <p-button label="Nueva Marca" icon="pi pi-plus" (onClick)="openNew()"></p-button>
      </div>

      <div class="glass-panel p-3">
        <p-table [value]="brands" [paginator]="true" [rows]="10" responsiveLayout="scroll">
          <ng-template pTemplate="header">
            <tr>
              <th>Logo</th>
              <th pSortableColumn="name">Nombre <p-sortIcon field="name"></p-sortIcon></th>
              <th>Descripción</th>
              <th pSortableColumn="active">Estado <p-sortIcon field="active"></p-sortIcon></th>
              <th>Acciones</th>
            </tr>
          </ng-template>
          <ng-template pTemplate="body" let-brand>
            <tr>
              <td>
                <img *ngIf="brand.logoUrl" [src]="brand.logoUrl" [alt]="brand.name" width="50" class="shadow-2 border-round" />
                <div *ngIf="!brand.logoUrl" class="w-3rem h-3rem border-circle surface-300 flex align-items-center justify-content-center">
                  <i class="pi pi-image text-500 text-xl"></i>
                </div>
              </td>
              <td class="font-bold">{{brand.name}}</td>
              <td>{{brand.description | slice:0:50}}...</td>
              <td>
                <span [class]="'p-badge ' + (brand.active ? 'p-badge-success' : 'p-badge-danger')">
                  {{brand.active ? 'Activo' : 'Inactivo'}}
                </span>
              </td>
              <td>
                <p-button icon="pi pi-pencil" styleClass="p-button-rounded p-button-success mr-2" (onClick)="editBrand(brand)"></p-button>
                <p-button icon="pi pi-trash" styleClass="p-button-rounded p-button-danger" (onClick)="deleteBrand(brand)"></p-button>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>

      <p-dialog [(visible)]="brandDialog" [style]="{width: '450px'}" [header]="isEditing ? 'Editar Marca' : 'Nueva Marca'" [modal]="true" styleClass="p-fluid">
        <ng-template pTemplate="content">
          <form [formGroup]="brandForm" class="flex flex-column gap-3 mt-2">
            <div class="field">
              <label for="name">Nombre *</label>
              <input type="text" pInputText id="name" formControlName="name" required autofocus />
              <small class="p-error" *ngIf="brandForm.controls['name'].invalid && submitted">El nombre es requerido.</small>
            </div>
            
            <div class="field">
              <label for="description">Descripción</label>
              <textarea id="description" pInputTextarea formControlName="description" rows="3" cols="20"></textarea>
            </div>

            <div class="field">
              <label for="logoUrl">URL del Logo</label>
              <input type="text" pInputText id="logoUrl" formControlName="logoUrl" />
            </div>

            <div class="field flex align-items-center justify-content-between mt-2" *ngIf="isEditing">
              <label for="active" class="mb-0">Estado Activo</label>
              <p-inputSwitch id="active" formControlName="active"></p-inputSwitch>
            </div>
          </form>
        </ng-template>

        <ng-template pTemplate="footer">
          <p-button label="Cancelar" icon="pi pi-times" styleClass="p-button-text" (onClick)="hideDialog()"></p-button>
          <p-button label="Guardar" icon="pi pi-check" styleClass="p-button-primary" (onClick)="saveBrand()"></p-button>
        </ng-template>
      </p-dialog>
    </div>
  `
})
export class ManageBrandsComponent implements OnInit {
  private brandService = inject(BrandService);
  private messageService = inject(MessageService);
  private fb = inject(FormBuilder);

  brands: Brand[] = [];
  brandDialog = false;
  isEditing = false;
  submitted = false;
  currentBrandId?: number;

  brandForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    description: [''],
    logoUrl: [''],
    active: [true]
  });

  ngOnInit() {
    this.loadBrands();
  }

  loadBrands() {
    this.brandService.getAll(false).subscribe({
      next: (data) => this.brands = data,
      error: (err) => this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudieron cargar las marcas'})
    });
  }

  openNew() {
    this.brandForm.reset({ active: true });
    this.isEditing = false;
    this.submitted = false;
    this.brandDialog = true;
  }

  editBrand(brand: Brand) {
    this.currentBrandId = brand.id;
    this.brandForm.patchValue(brand);
    this.isEditing = true;
    this.brandDialog = true;
  }

  deleteBrand(brand: Brand) {
    if(confirm(`¿Estás seguro que deseas eliminar la marca ${brand.name}?`)) {
      this.brandService.delete(brand.id!).subscribe({
        next: () => {
          this.loadBrands();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Marca eliminada'});
        },
        error: (err) => this.messageService.add({severity:'error', summary: 'Error', detail: 'No se pudo eliminar la marca'})
      });
    }
  }

  hideDialog() {
    this.brandDialog = false;
    this.submitted = false;
  }

  saveBrand() {
    this.submitted = true;
    if (this.brandForm.invalid) return;

    const brandData: Brand = this.brandForm.value;

    if (this.isEditing && this.currentBrandId) {
      this.brandService.update(this.currentBrandId, brandData).subscribe({
        next: () => {
          this.loadBrands();
          this.hideDialog();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Marca actualizada'});
        },
        error: (err) => this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al actualizar'})
      });
    } else {
      this.brandService.create(brandData).subscribe({
        next: () => {
          this.loadBrands();
          this.hideDialog();
          this.messageService.add({severity:'success', summary: 'Éxito', detail: 'Marca creada'});
        },
        error: (err) => this.messageService.add({severity:'error', summary: 'Error', detail: 'Error al crear'})
      });
    }
  }
}
