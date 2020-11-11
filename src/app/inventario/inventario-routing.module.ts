import { Routes } from '@angular/router';

import { LayoutComponent } from './layout.component';
import { InventarioComponent } from './inventario.component';

export const routes: Routes = [
    {
        path: '', component: LayoutComponent,
        children: [
            { path: 'add', component: InventarioComponent },
            { path: 'edit/:id', component: InventarioComponent }
        ]
    }
];

