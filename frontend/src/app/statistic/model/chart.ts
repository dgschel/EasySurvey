import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTooltip, ApexTitleSubtitle, ApexLegend, ApexGrid, ApexResponsive, ApexStroke } from "ng-apexcharts";

export type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  responsive: ApexResponsive[];
  legend: ApexLegend;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: string[];
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};