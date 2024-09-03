import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTooltip, ApexTitleSubtitle } from "ng-apexcharts";

export type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
};