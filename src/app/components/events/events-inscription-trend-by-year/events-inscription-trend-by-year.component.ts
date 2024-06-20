import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {EventService} from "../../../services/rallyroundapi/event.service";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";
import {ChartData, ChartDataset, Plugin} from "chart.js";
import {customBackgroundColor} from "../../../utils/chartjs-plugins";
import jsPDF from "jspdf";
import {numberToMonthSpanishName} from "../../../utils/NumberToMonthSpanishName";

@Component({
  selector: 'rr-events-inscription-trend-by-year',
  standalone: true,
  imports: [
    BaseChartDirective,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [DatePipe],
  templateUrl: './events-inscription-trend-by-year.component.html',
  styleUrl: './events-inscription-trend-by-year.component.css'
})
export class EventsInscriptionTrendByYearComponent implements OnInit, OnDestroy {
  private eventService: EventService = inject(EventService);
  private datePipe: DatePipe = inject(DatePipe);
  private subs: Subscription = new Subscription();

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;
  chartPlugins: Plugin[] = [customBackgroundColor];

  selectedYear: number = new Date().getFullYear();

  chartDataSet: ChartData<'line'> = {
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
      this.eventService.getEventsInscriptionTrendByYear(this.selectedYear).subscribe({
        next: statistics => {
          this.chartDataSet = {
            labels: [],
            datasets: []
          };
          const inscriptionsCountDataSet: ChartDataset<'line'> = {
            data: [],
            label: "Inscripciones totales",
          }
          const incompleteInscriptionsCountDataSet: ChartDataset<'line'> = {
            data: [],
            label: "Inscripciones incompletas",
          }
          const canceledInscriptionsCountDataSet: ChartDataset<'line'> = {
            data: [],
            label: "Inscripciones canceladas",
          }
          const abandonmentCountDataSet: ChartDataset<'line'> = {
            data: [],
            label: "Abandonos de evento",
          }

          statistics.trends.forEach(trendsByMonth => {
            // @ts-ignore
            this.chartDataSet.labels.push(numberToMonthSpanishName(trendsByMonth.month));
            inscriptionsCountDataSet.data.push(trendsByMonth.trends.inscriptionsCount);
            incompleteInscriptionsCountDataSet.data.push(trendsByMonth.trends.incompleteInscriptionsCount);
            canceledInscriptionsCountDataSet.data.push(trendsByMonth.trends.canceledInscriptionCount);
            abandonmentCountDataSet.data.push(trendsByMonth.trends.abandonmentCount);
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

    let pdf = new jsPDF({
      orientation: "landscape"
    });
    pdf.setFontSize(16);
    pdf.text("Eventos - Tendencias de inscripción.", 15, 15);
    pdf.text("Fecha de generación: " + this.datePipe.transform(currentDate, "d/MM/y, h:mm a"), 150, 15);
    pdf.text(`Año: ${this.selectedYear}`, 15, 22);
    pdf.addImage(canvasImage, 'JPEG', 15, 30, 280, 150);
    pdf.save("eventos-tendencias-de-inscripción.pdf");
  }
}
