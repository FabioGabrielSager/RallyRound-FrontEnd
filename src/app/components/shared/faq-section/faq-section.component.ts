import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FaqDto} from "../../../models/faqDto";
import {FaqService} from "../../../services/rallyroundapi/faq.service";
import {Subscription} from "rxjs";
import {ToastService} from "../../../services/toast.service";
import {NgbCollapse} from "@ng-bootstrap/ng-bootstrap";
import {NgClass} from "@angular/common";
import {NavbarComponent} from "../navbar/navbar.component";

interface CollapsedFaq {
  faq: FaqDto;
  isCollapsed: boolean;
}


@Component({
  selector: 'rr-faq-section',
  standalone: true,
  imports: [
    NgbCollapse,
    NgClass,
    NavbarComponent
  ],
  templateUrl: './faq-section.component.html',
  styleUrl: './faq-section.component.css'
})
export class FaqSectionComponent implements OnInit, OnDestroy {
  private faqService: FaqService = inject(FaqService);
  private toastService: ToastService = inject(ToastService);
  private sub: Subscription = new Subscription();
  faqs: CollapsedFaq[] = [];

  ngOnInit(): void {
    this.sub = this.faqService.getFAQs().subscribe(
      {
        next: value => {
          this.faqs = value.map(
            f => {
              return { faq: f, isCollapsed: true } as CollapsedFaq;
            }
          );
        },
        error: err => {
          this.toastService.show("Hubo un error al intentar recuperar las preguntas frecuentes.",
            "bg-danger");
          console.error(err);
        }
      }
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
