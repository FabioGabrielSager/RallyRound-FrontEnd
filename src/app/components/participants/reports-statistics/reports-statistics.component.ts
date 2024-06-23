import {Component, ElementRef, inject, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FormsModule} from "@angular/forms";
import {RrActivityService} from "../../../services/rallyroundapi/rr-activity.service";
import {DatePipe} from "@angular/common";
import {Subscription} from "rxjs";
import {ChartConfiguration, ChartData, ChartDataset, Plugin} from "chart.js";
import {customBackgroundColor} from "../../../utils/chartjs-plugins";
import {numberToMonthSpanishName} from "../../../utils/NumberToMonthSpanishName";
import jsPDF from "jspdf";
import {ParticipantService} from "../../../services/rallyroundapi/participant.service";
import {BaseChartDirective} from "ng2-charts";

@Component({
  selector: 'rr-reports-statistics',
  standalone: true,
  imports: [
    FormsModule,
    BaseChartDirective
  ],
  providers: [DatePipe],
  templateUrl: './reports-statistics.component.html',
  styleUrl: './reports-statistics.component.css'
})
export class ReportsStatisticsComponent implements OnInit, OnDestroy {
  private participantService: ParticipantService = inject(ParticipantService);
  private datePipe: DatePipe = inject(DatePipe);
  private subs: Subscription = new Subscription();

  @ViewChild("canvas")
  canvas!: ElementRef<HTMLCanvasElement>;
  chartPlugins: Plugin[] = [customBackgroundColor];

  selectedMonth: number = new Date().getMonth()+1;
  selectedYear: number = new Date().getFullYear();

  chartDataSet: ChartData<'bar'> = {
    labels: [],
    datasets: []
  };

  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    plugins: {
      legend: {
        display: false,
      }
    },
    indexAxis: "y"
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
      this.participantService.getReportsCount(this.selectedYear, this.selectedMonth).subscribe({
        next: statistics => {
          this.chartDataSet = {
            labels: ["comportamiento inapropiado", "spam", "acoso", "lenguaje ofensivo", "fraude",
              "Suplantación de identidad", "Contenido inapropiado", "absentismo", "otros motivos"],
            datasets: [
              {
                data: [
                  statistics.inappropriateBehaviorReportsCount,
                  statistics.spammingReportsCount,
                  statistics.harassmentReportCounts,
                  statistics.offensiveLanguageReportCounts,
                  statistics.fraudReportCounts,
                  statistics.impersonationReportCounts,
                  statistics.inappropriateContentReportCounts,
                  statistics.absenteeismReportCounts,
                  statistics.otherMotivesReportCounts
                ]
              }
            ]
          };
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
      currentDate.getMonth() + 1 : this.selectedMonth);

    let pdf = new jsPDF({
      orientation: "landscape"
    });
    pdf.setFontSize(16);
    pdf.text("Reportes de usuario.", 15, 15);
    pdf.text("Fecha de generación: " + this.datePipe.transform(currentDate, "d/MM/y, h:mm a"), 150, 15);
    pdf.text(`Mes: ${month} Año: ${this.selectedYear}`, 15, 22);
    pdf.addImage(canvasImage, 'JPEG', 15, 30, 280, 150);
    pdf.save("resumen-reportes-de-usuario.pdf");
  }
}
