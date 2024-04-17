import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'app-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
    form: FormGroup | undefined;
    imageUrls: string[] = [];

    constructor(private formBuilder: FormBuilder) { }

    ngOnInit(): void {
        this.form = this.formBuilder.group({
            // Define form controls here
        });
    }

    onFileSelected(event: any) {
        const files: FileList = event.target.files;
        for (let i = 0; i < files.length; i++) {
            const file: File = files[i];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e: any) => {
                    this.imageUrls.push(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }

    onSubmit() {
        // Handle form submission here
    }
}