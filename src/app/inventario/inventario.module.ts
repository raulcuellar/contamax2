import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { InventarioRoutingModule } from "./InventarioRoutingModule";
import { LayoutComponent } from './layout.component';
import { InventarioComponent } from './inventario.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InventarioRoutingModule
    ],
    declarations: [
        LayoutComponent,
        InventarioComponent
    ]
})
export class InventarioModule { }