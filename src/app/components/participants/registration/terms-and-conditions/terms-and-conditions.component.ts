import {Component, inject, Input, OnDestroy, OnInit} from '@angular/core';
import {CdkDrag, CdkDragHandle, CdkDropList} from "@angular/cdk/drag-drop";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SearchResultsListComponent} from "../../../shared/search-results-list/search-results-list.component";
import {DocumentDto} from "../../../../models/documentDto";
import {DocumentService} from "../../../../services/rallyroundapi/document.service";
import {Subscription} from "rxjs";
import {AuthService} from "../../../../services/auth/auth.service";
import {Router} from "@angular/router";
import {ToastService} from "../../../../services/toast.service";

@Component({
  selector: 'rr-terms-and-conditions',
  standalone: true,
    imports: [
        CdkDrag,
        CdkDragHandle,
        CdkDropList,
        FormsModule,
        ReactiveFormsModule,
        SearchResultsListComponent
    ],
  templateUrl: './terms-and-conditions.component.html',
  styleUrl: './terms-and-conditions.component.css'
})
export class TermsAndConditionsComponent implements OnInit, OnDestroy {
  private documentService: DocumentService = inject(DocumentService);
  private authService: AuthService = inject(AuthService);
  private toastService: ToastService = inject(ToastService);
  private router: Router = inject(Router);
  private subs: Subscription = new Subscription();
  termsAndConditions: DocumentDto = { title:"", content:"", contentType:"" } as DocumentDto;

  @Input() showAcceptAndDenyButtons: boolean = true;

  ngOnInit(): void {
    this.subs.add(
      this.documentService.getRrTermsAndConditionsHtml().subscribe({
        next: value => {
          this.termsAndConditions = value;
        },
        error: err => console.error(err)
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  onClickReject() {
    this.router.navigate(["/home"]);
  }

  onClickAccept() {
    this.authService.setHasAcceptedTermsAndConditions(true);
    this.subs.add(
      this.authService.sendRegistrationRequest().subscribe(
        {
          next: value => {
            this.router.navigate(['/participant/register/',
                {
                  outlets: {
                    registration: ['confirmEmail', {userEmail: value.userEmail}]
                  }
                }
              ]
            );
          },
          error: err => {
            this.toastService.show("Hubo un error al enviar la solicitud de registro, por favor inténtelo más tarde.",
              "bg-danger");
            console.error(err);
          }
        }
      )
    );
  }
}
