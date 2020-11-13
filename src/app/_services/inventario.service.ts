import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { Inventario } from '@app/_models';

@Injectable({ providedIn: 'root' })
export class InventarioService {
    inventario(value: any) {
        throw new Error('Method not implemented.');
    }
    private InventarioSubject: BehaviorSubject<Inventario>;
    public Inventario: Observable<Inventario>;

    constructor(
        private router: Router,
        private http: HttpClient
    ) {
        this.InventarioSubject = new BehaviorSubject<Inventario>(JSON.parse(localStorage.getItem('Inventario')));
        this.Inventario = this.InventarioSubject.asObservable();
    }

    public get InventarioValue(): Inventario {
        return this.InventarioSubject.value;
    }

    getAll() {
        return this.http.get<Inventario[]>(`${environment.apiUrl}/Inventarios`);
    }

    getById(id: string) {
        return this.http.get<Inventario>(`${environment.apiUrl}/Inventarios/${id}`);
    }

    update(id, params) {
        return this.http.put(`${environment.apiUrl}/Inventarios/${id}`, params)
            .pipe(map(inventario => {
                // update stored Inventario if the logged in Inventario updated their own record
                if (id == this.InventarioValue.id) {
                    // update local storage
                    const Inventario = { ...this.InventarioValue, ...params };
                    localStorage.setItem('Inventario', JSON.stringify(Inventario));

                    // publish updated Inventario to subscribers
                    this.InventarioSubject.next(Inventario);
                }
                return inventario;
            }));
    }
}