import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {FormsModule} from "@angular/forms";
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";
import {ChartData, ChartDataset, Plugin} from "chart.js";
import {customBackgroundColor} from "../../../utils/chartjs-plugins";
import {EventService} from "../../../services/rallyroundapi/event.service";
import jsPDF from "jspdf";
import {numberToMonthSpanishName} from "../../../utils/NumberToMonthSpanishName";

@Component({
  selector: 'rr-created-events-inscription-trend-stats',
  standalone: true,
    imports: [
        BaseChartDirective,
        FormsModule,
        HasPrivilegeDirective,
        NgbDropdown,
        NgbDropdownMenu,
        NgbDropdownToggle
    ],
  providers: [DatePipe],
  templateUrl: './created-events-inscription-trend-stats.component.html',
  styleUrl: './created-events-inscription-trend-stats.component.css'
})
export class CreatedEventsInscriptionTrendStatsComponent  implements OnInit, OnDestroy {
  private eventService: EventService = inject(EventService);
  private datePipe: DatePipe = inject(DatePipe);
  private subs: Subscription = new Subscription();

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;
  chartPlugins: Plugin[] = [customBackgroundColor];

  selectedMonth: number = 0;
  selectedYear: number = new Date().getFullYear();

  chartDataSet: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  constructor() {
    this.loadData();
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadData() {
    this.subs.add(
      this.eventService.getCreatedEventInscriptionTrend(this.selectedMonth, this.selectedYear).subscribe({
        next: statistics => {
          this.chartDataSet = {
            labels: [],
            datasets: []
          };
          const inscriptionsCountDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Inscripciones totales",
          }
          const incompleteInscriptionsCountDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Inscripciones incompletas",
          }
          const canceledInscriptionsCountDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Inscripciones canceladas",
          }
          const abandonmentCountDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Abandonos de evento",
          }

          statistics.results.forEach(eventData => {
            // @ts-ignore
            this.chartDataSet.labels.push(eventData.eventActivity + " " + eventData.eventDate);
            inscriptionsCountDataSet.data.push(eventData.trend.inscriptionsCount);
            incompleteInscriptionsCountDataSet.data.push(eventData.trend.incompleteInscriptionsCount);
            canceledInscriptionsCountDataSet.data.push(eventData.trend.canceledInscriptionCount);
            abandonmentCountDataSet.data.push(eventData.trend.abandonmentCount);
          });

          this.chartDataSet.datasets.push(inscriptionsCountDataSet, incompleteInscriptionsCountDataSet,
            canceledInscriptionsCountDataSet, abandonmentCountDataSet);
        },
        error: err => {
          console.error(err);
        }
      })
    );
  }

  onDownloadPdf() {
    const currentDate: Date = new Date();
    const canvasImage = this.canvas.nativeElement.toDataURL("image/jpeg", 1.0);
    const month = numberToMonthSpanishName(this.selectedMonth === 0 ?
      currentDate.getMonth()+1 : this.selectedMonth);

    let pdf = new jsPDF({
      orientation: "landscape"
    });
    pdf.setFontSize(16);
    pdf.text("Mis eventos - Tendencias de inscripción.", 15, 15);
    pdf.text("Fecha de generación: " + this.datePipe.transform(currentDate, "d/MM/y, h:mm a"), 150, 15);
    pdf.text(`Mes: ${month} Año: ${this.selectedYear}`, 15, 22);
    pdf.addImage(canvasImage, 'JPEG', 15, 30, 280, 150);
    pdf.save("eventos-tendencias-de-inscripción.pdf");
  }
}
