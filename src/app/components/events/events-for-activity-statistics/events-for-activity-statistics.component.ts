import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ChartData, ChartDataset, Plugin} from "chart.js";
import {BaseChartDirective} from "ng2-charts";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {Subscription} from "rxjs";
import {customBackgroundColor} from "../../../utils/chartjs-plugins";
import jsPDF from "jspdf";
import {numberToMonthSpanishName} from "../../../utils/NumberToMonthSpanishName";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {DatePipe} from "@angular/common";
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";

@Component({
  selector: 'rr-events-for-activity-statistics',
  standalone: true,
  imports: [
    FormsModule,
    BaseChartDirective,
    ReactiveFormsModule,
    NgbDropdown,
    NgbDropdownMenu,
    NgbDropdownToggle,
    HasPrivilegeDirective
  ],
  providers: [DatePipe],
  templateUrl: './events-for-activity-statistics.component.html',
  styleUrl: './events-for-activity-statistics.component.css'
})
export class EventsForActivityStatisticsComponent implements OnInit, OnDestroy {
  private activityService: RrActivityService = inject(RrActivityService);
  private datePipe: DatePipe = inject(DatePipe);
  private subs: Subscription = new Subscription();

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;
  chartPlugins: Plugin[] = [customBackgroundColor];


  selectedMonth: number = 0;
  inscriptionFeeType: string = "both";

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
      this.activityService.getEventsForActivityByMonth(this.selectedMonth, this.inscriptionFeeType).subscribe({
        next: statistics => {
          this.chartDataSet = {
            labels: [],
            datasets: []
          };
          const finalizedEventDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Finalizados",
          }
          const canceledEventDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Cancelados",
          }
          const otherStateEventDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Activos",
          }

          statistics.results.forEach(activityData => {
            // @ts-ignore
            this.chartDataSet.labels.push(activityData.activity);
            finalizedEventDataSet.data.push(activityData.finalizedEventsCount);
            canceledEventDataSet.data.push(activityData.canceledEventsCount);
            otherStateEventDataSet.data.push(activityData.activeEventsCount);
          });

          this.chartDataSet.datasets.push(finalizedEventDataSet, canceledEventDataSet, otherStateEventDataSet)
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
    let inscriptionFeeType = "";

    if(this.inscriptionFeeType === "both") {
      inscriptionFeeType = "Pagas y no pagas";
    } else {
      if(this.inscriptionFeeType === "unpaid") {
        inscriptionFeeType = "No paga"
      } else {
        inscriptionFeeType = "Paga";
      }
    }

    let pdf = new jsPDF({
      orientation: "landscape"
    });
    pdf.setFontSize(16);
    pdf.text("Eventos por actividad.", 15, 15);
    pdf.text("Fecha de generación: " + this.datePipe.transform(currentDate, "d/MM/y, h:mm a"), 150, 15);
    pdf.text(`Mes: ${month} Año: ${currentDate.getFullYear()}`, 15, 22);
    pdf.text("Tipo de inscripción: " + inscriptionFeeType, 15, 29);
    pdf.addImage(canvasImage, 'JPEG', 15, 30, 280, 150);
    pdf.save("eventos-por-actividad.pdf");
  }
}
