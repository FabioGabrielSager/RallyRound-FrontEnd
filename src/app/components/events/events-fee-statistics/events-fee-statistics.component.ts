import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {BaseChartDirective} from "ng2-charts";
import {FormsModule} from "@angular/forms";
import {HasPrivilegeDirective} from "../../../directive/has-privilege.directive";
import {NgbDropdown, NgbDropdownMenu, NgbDropdownToggle} from "@ng-bootstrap/ng-bootstrap";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";
import {ChartData, ChartDataset, Plugin} from "chart.js";
import {customBackgroundColor} from "../../../utils/chartjs-plugins";
import {numberToMonthSpanishName} from "../../../utils/NumberToMonthSpanishName";
import jsPDF from "jspdf";
import {EventService} from "../../../services/rallyroundapi/event.service";

@Component({
  selector: 'rr-events-fee-statistics',
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
  templateUrl: './events-fee-statistics.component.html',
  styleUrl: './events-fee-statistics.component.css'
})
export class EventsFeeStatisticsComponent implements OnInit, OnDestroy {
  private eventService: EventService = inject(EventService);
  private datePipe: DatePipe = inject(DatePipe);
  private subs: Subscription = new Subscription();

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;
  chartPlugins: Plugin[] = [customBackgroundColor];

  dateFrom: string = new Date().toISOString().split('T')[0];
  dateTo: string = new Date().toISOString().split('T')[0];

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
      this.eventService.getEventsFeeStats(this.dateFrom, this.dateTo).subscribe({
        next: statistics => {
          this.chartDataSet = {
            labels: [],
            datasets: []
          };
          const totalEventDataSet: ChartDataset<'bar'> = {
            data: [],
            label: "Total",
          }

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

          // @ts-ignore
          this.chartDataSet.labels.push("Pagos");
          totalEventDataSet.data.push(statistics.paidEventsCount.totalEventsCount);
          finalizedEventDataSet.data.push(statistics.paidEventsCount.finalizedEventsCount);
          canceledEventDataSet.data.push(statistics.paidEventsCount.canceledEventsCount);
          otherStateEventDataSet.data.push(statistics.paidEventsCount.activeEventsCount);

          // @ts-ignore
          this.chartDataSet.labels.push("No Pagos");
          totalEventDataSet.data.push(statistics.unpaidEventsCount.totalEventsCount);
          finalizedEventDataSet.data.push(statistics.unpaidEventsCount.finalizedEventsCount);
          canceledEventDataSet.data.push(statistics.unpaidEventsCount.canceledEventsCount);
          otherStateEventDataSet.data.push(statistics.unpaidEventsCount.activeEventsCount);

          this.chartDataSet.datasets.push(totalEventDataSet, finalizedEventDataSet, canceledEventDataSet, otherStateEventDataSet);
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
    pdf.text("Eventos pagos y no pagos.", 15, 15);
    pdf.text("Fecha de generación: " + this.datePipe.transform(currentDate, "d/MM/y, h:mm a"), 150, 15);
    pdf.text(`Desde: ${this.datePipe.transform(this.dateFrom, "d/MM/y")} Hasta: ${this.datePipe.transform(this.dateTo, "d/MM/y")} `,
      15, 22);
    pdf.addImage(canvasImage, 'JPEG', 15, 30, 280, 150);
    pdf.save("eventos-pagos-y-no-pagos.pdf");
  }
}
