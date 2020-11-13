import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { InventarioService } from '../_services/inventario.service';
import { AlertService } from '../_services/alert.service'

@Component({ templateUrl: 'inventario.component.html' })
export class InventarioComponent implements OnInit {
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private inventarioService: InventarioService,
        private alertService: AlertService,
    ) {}

    ngOnInit() {
        this.id = this.route.snapshot.params['id'];
        this.isAddMode = !this.id;

        this.form = this.formBuilder.group({
            item: ['', Validators.required],
            clave: ['', Validators.required],
            descripcion: ['', Validators.required],
            inicial: ['', Validators.required],
        });

        if (!this.isAddMode) {
            this.inventarioService.getById(this.id)
                .pipe(first())
                .subscribe(inventario => this.form.patchValue(inventario));
        }
    }

    // convenience getter for easy access to form fields
    get f() { return this.form.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.form.invalid) {
            return;
        }

        this.loading = true;
        if (this.isAddMode) {
            this.createItem();
        } else {
            this.updateItem();
        }
    }

    private createItem() {
        this.inventarioService.inventario(this.form.value)
            .item(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Item añadido', { keepAfterRouteChange: true });
                    this.router.navigate(['../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }

    private updateItem() {
        this.inventarioService.update(this.id, this.form.value)
            .pipe(first())
            .subscribe({
                next: () => {
                    this.alertService.success('Actualización exitosa', { keepAfterRouteChange: true });
                    this.router.navigate(['../../'], { relativeTo: this.route });
                },
                error: error => {
                    this.alertService.error(error);
                    this.loading = false;
                }
            });
    }
}