import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ItemService } from '../services/item.service';

@Component({
    selector: 'app-listing',
    templateUrl: './listing.component.html',
    styleUrls: ['./listing.component.scss']
})
export class ListingComponent implements OnInit {
    form: FormGroup | undefined;
    image = null;
    @ViewChild('fileInput')
    fileInput;
    private baseUrl:string = "/api/Item"
    constructor(private formBuilder: FormBuilder, private http: HttpClient, private itemService: ItemService) { }

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
                    this.image=(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        }
    }
    onClickFileInputButton(event: any): void {
        event.preventDefault();
        this.fileInput.nativeElement.click();
    }    


    onSubmit(items: {imageURL: string, name: string, quantity: number, description: string, price: number
})
         {
        items.imageURL = this.image
        console.log(items);
        this.itemService.itemAdd(items)
        // Handle form submission here
        .subscribe(() => {
           alert("Items Added");

        })
    }
}