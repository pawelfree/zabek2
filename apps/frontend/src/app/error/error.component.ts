import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
    templateUrl: './error.component.html'
})
export class ErrorComponent {
    message = 'Wystąpił nieznany błąd!';

    constructor(@Inject(MAT_DIALOG_DATA) public readonly data: { message: string, status: string } ) {}

}