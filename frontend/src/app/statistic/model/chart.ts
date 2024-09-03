import { ApexAxisChartSeries, ApexChart, ApexXAxis, ApexDataLabels, ApexPlotOptions, ApexYAxis, ApexTooltip, ApexTitleSubtitle, ApexLegend, ApexGrid } from "ng-apexcharts";

export type ChartOption = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  grid: ApexGrid;
  legend: ApexLegend;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  tooltip: ApexTooltip;
  colors: string[];
  title: ApexTitleSubtitle;
};