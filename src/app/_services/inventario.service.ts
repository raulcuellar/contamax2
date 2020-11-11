import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Inventario } from '../_models/inventario';
import { inventario } from '../../environments/environment.prod';

@Injectable({ providedIn: 'root' })
export class InventarioService {
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

    login(Inventarioname, password) {
        return this.http.post<Inventario>(`${inventario.apiUrl}/Inventarios/authenticate`, { Inventarioname, password })
            .pipe(map(Inventario => {
                // store Inventario details and jwt token in local storage to keep Inventario logged in between page refreshes
                localStorage.setItem('Inventario', JSON.stringify(Inventario));
                this.InventarioSubject.next(Inventario);
                return Inventario;
            }));
    }

    logout() {
        // remove Inventario from local storage and set current Inventario to null
        localStorage.removeItem('Inventario');
        this.InventarioSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(Inventario: Inventario) {
        return this.http.post(`${inventario.apiUrl}/Inventarios/register`, Inventario);
    }

    getAll() {
        return this.http.get<Inventario[]>(`${inventario.apiUrl}/Inventarios`);
    }

    getById(id: string) {
        return this.http.get<Inventario>(`${inventario.apiUrl}/Inventarios/${id}`);
    }

    update(id, params) {
        return this.http.put(`${inventario.apiUrl}/Inventarios/${id}`, params)
            .pipe(map(x => {
                // update stored Inventario if the logged in Inventario updated their own record
                if (id == this.InventarioValue.id) {
                    // update local storage
                    const Inventario = { ...this.InventarioValue, ...params };
                    localStorage.setItem('Inventario', JSON.stringify(Inventario));

                    // publish updated Inventario to subscribers
                    this.InventarioSubject.next(Inventario);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${inventario.apiUrl}/Inventarios/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in Inventario deleted their own record
                if (id == this.InventarioValue.id) {
                    this.logout();
                }
                return x;
            }));
    }
}