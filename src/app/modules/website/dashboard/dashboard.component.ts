import { Component, inject, ViewChild } from '@angular/core';
// import { ChartOptions } from '../dealerAdmin/dealerreport/dealerreport.component';
import { ApexOptions, ApexTheme, ChartComponent } from 'ng-apexcharts';
import {
  ApexAxisChartSeries,
  ApexNonAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexStroke,
  ApexYAxis,
  ApexLegend,
  ApexFill,
  ApexGrid,
  ApexPlotOptions,
  ApexTooltip,
  ApexMarkers
} from 'ng-apexcharts';
import { forkJoin } from 'rxjs';
import { DashboardService } from 'src/app/_servies/dashboard/dashboard.service';
import { HotelsService } from 'src/app/_servies/hotels/hotels.service';
import { ReservationService } from 'src/app/_servies/reservation/reservation.service';
import { ChartDB } from 'src/app/fack-db/chartData';
import * as moment from "moment";
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';  // ✅ Import the UTC plugin
dayjs.extend(utc); 

export type ChartOptions = {
  series: ApexAxisChartSeries | ApexNonAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  tooltip: ApexTooltip;
  labels: string[];
  colors: string[];
  legend: ApexLegend;
  fill: ApexFill;
  grid: ApexGrid;
  markers: ApexMarkers;
  theme: ApexTheme;
};

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  private _toastr = inject(ToastrService)
  private _reservationService = inject(ReservationService);

  date_range: any = { startDate: '', endDate: '' }

  timezone: any;
  // Variables for filters
  selectedTimePeriod: string = 'daily';
  startDate: string = '';
  endDate: string = '';
  selectedAirline: any = null;
  selectedHotel: any = null;
  selectedPort: any = null;
  breakdownPort: any = null;
  breakdownHotel: any = null;

  // Service filters
  isRoomsRevenueActive: boolean = false;
  isBreakfastRevenueActive: boolean = false;
  isDinnerRevenueActive: boolean = false;
  dashboardData: any = [];
  RevenueData: any = [];
  operationalData: any[] = [];
  revenueGraph: any = [];
  MarginData: any = [];

  ranges: any = {
    Today: [moment(), moment()],
    Yesterday: [moment().subtract(1, "days"), moment().subtract(1, "days")],
    "Last 7 Days": [moment().subtract(6, "days"), moment()],
    "Last 30 Days": [moment().subtract(29, "days"), moment()],
    "This Month": [moment().startOf("month"), moment().endOf("month")],
    "Last Month": [
      moment().subtract(1, "month").startOf("month"),
      moment().subtract(1, "month").endOf("month"),
    ],
  };
  start_date: string | null = null;
  end_date: string | null = null;

  chartDB: any;
  lastDate!: number;
  // eslint-disable-next-line
  data: any;
  // eslint-disable-next-line
  intervalSub: any;
  // eslint-disable-next-line
  intervalMain: any;

  line1CAC!: ApexOptions;
  line2CAC!: ApexOptions;
  line3CAC: ApexOptions | undefined;
  area1CAC: ApexOptions | undefined;
  bar1CAC: ApexOptions;
  pie1CAC: ApexOptions;
  // public props
  @ViewChild('chart') chart!: ChartComponent;
  @ViewChild('customerChart') customerChart!: ChartComponent;

  @ViewChild("chart4") chart4: ChartComponent | undefined;
  // public chartOptions4: Partial<ChartOptions>;
  chartOptions!: Partial<ChartOptions>;
  chartOptions_1!: Partial<ChartOptions>;
  chartOptions_2!: Partial<ChartOptions>;
  chartOptions_3!: Partial<ChartOptions>;

  // constructor
  constructor(
    private api: DashboardService,
    private _hotelService: HotelsService,
    private datePipe: DatePipe,
    private cdr: ChangeDetectorRef
  ) {

    this.chartOptions_1 = {
      chart: {
        height: 300,
        type: 'donut',
      },
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        pie: {
          donut: {
            size: '75%',
          },
        },
      },
      labels: ['Profit', 'Cost'],
      series: [
        this.dashboardData?.totalProfit || 0,
        this.dashboardData?.totalCost || 0
      ], // Adjusted for profit vs. cost distribution
      legend: {
        show: false,
      },
      tooltip: {
        theme: 'dark',
        y: {
          formatter: (value: number) => `€${value}`
        }
      },
      grid: {
        padding: {
          top: 20,
          right: 0,
          bottom: 0,
          left: 0,
        },
      },
      colors: ['#0D213A', '#6EC1E4'], // Colors for Profit and Cost
      fill: {
        opacity: [1, 1],
      },
      stroke: {
        width: 0,
      },
    };

    // this.chartOptions_2 = {
    //   chart: {
    //     height: 150,
    //     type: 'donut'
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   plotOptions: {
    //     pie: {
    //       donut: {
    //         size: '75%'
    //       }
    //     }
    //   },
    //   labels: ['New', 'Return'],
    //   series: [20, 15],
    //   legend: {
    //     show: false
    //   },
    //   tooltip: {
    //     theme: 'dark'
    //   },
    //   grid: {
    //     padding: {
    //       top: 20,
    //       right: 0,
    //       bottom: 0,
    //       left: 0
    //     }
    //   },
    //   colors: ['#fff', '#2ed8b6'],
    //   fill: {
    //     opacity: [1, 1]
    //   },
    //   stroke: {
    //     width: 0
    //   }
    // };

    // this.chartOptions_3 = {
    //   chart: {
    //     type: 'area',
    //     height: 145,
    //     sparkline: {
    //       enabled: true
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   colors: ['#ff5370'],
    //   fill: {
    //     type: 'gradient',
    //     gradient: {
    //       shade: 'dark',
    //       gradientToColors: ['#ff869a'],
    //       shadeIntensity: 1,
    //       type: 'horizontal',
    //       opacityFrom: 1,
    //       opacityTo: 0.8,
    //       stops: [0, 100, 100, 100]
    //     }
    //   },
    //   stroke: {
    //     curve: 'smooth',
    //     width: 2
    //   },
    //   series: [
    //     {
    //       data: [45, 35, 60, 50, 85, 70]
    //     }
    //   ],
    //   yaxis: {
    //     min: 5,
    //     max: 90
    //   },
    //   tooltip: {
    //     fixed: {
    //       enabled: false
    //     },
    //     x: {
    //       show: false
    //     },
    //     marker: {
    //       show: false
    //     }
    //   }
    // };

    // this.chartOptions4 = {
    //   series: [
    //     {
    //       name: "Net Profit",
    //       data: [44, 55, 57, 56, 61, 58, 63, 60, 66]
    //     },
    //     {
    //       name: "Revenue",
    //       data: [76, 85, 101, 98, 87, 105, 91, 114, 94]
    //     },

    //   ],
    //   chart: {
    //     type: "bar",
    //     height: 350
    //   },
    //   plotOptions: {
    //     bar: {
    //       horizontal: false,
    //       columnWidth: "40%",
    //       // endingShape: "rounded"
    //     }
    //   },
    //   dataLabels: {
    //     enabled: false
    //   },
    //   stroke: {
    //     show: true,
    //     width: 2,
    //     colors: ["transparent"]
    //   },
    //   xaxis: {
    //     categories: [
    //       "Feb",
    //       "Mar",
    //       "Apr",
    //       "May",
    //       "Jun",
    //       "Jul",
    //       "Aug",
    //       "Sep",
    //       "Oct"
    //     ]
    //   },
    //   yaxis: {
    //     title: {
    //       text: "$ (thousands)"
    //     }
    //   },
    //   fill: {
    //     opacity: 1
    //   },
    //   tooltip: {
    //     y: {
    //       formatter: function (val) {
    //         return "$ " + val + " thousands";
    //       }
    //     }
    //   }
    // };

    this.chartDB = ChartDB;
    const {
      line1CAC,
      line3CAC,
      area1CAC,
      bar1CAC,
      pie1CAC,
    } = this.chartDB;

    this.line1CAC = line1CAC;
    this.line3CAC = line3CAC;
    this.area1CAC = area1CAC;
    this.bar1CAC = bar1CAC;
    this.pie1CAC = pie1CAC;

    this.lastDate = 0;
    this.data = [];
  }

  // cards = [
  //   {
  //     background: 'bg-c-blue',
  //     title: 'Orders Received',
  //     icon: 'icon-shopping-cart',
  //     text: 'Completed Orders',
  //     number: '486',
  //     no: '351'
  //   },
  //   {
  //     background: 'bg-c-green',
  //     title: 'Total Sales',
  //     icon: 'icon-tag',
  //     text: 'This Month',
  //     number: '1641',
  //     no: '213'
  //   },
  //   {
  //     background: 'bg-c-yellow',
  //     title: 'Revenue',
  //     icon: 'icon-repeat',
  //     text: 'This Month',
  //     number: '$42,56',
  //     no: '$5,032'
  //   },
  //   {
  //     background: 'bg-c-red',
  //     title: 'Total Profit',
  //     icon: 'icon-shopping-cart',
  //     text: 'This Month',
  //     number: '$9,562',
  //     no: '$542'
  //   }
  // ];

  // images = [
  //   {
  //     src: 'assets/images/gallery-grid/img-grd-gal-1.jpg',
  //     title: 'Old Scooter',
  //     size: 'PNG-100KB'
  //   },
  //   {
  //     src: 'assets/images/gallery-grid/img-grd-gal-2.jpg',
  //     title: 'Wall Art',
  //     size: 'PNG-150KB'
  //   },
  //   {
  //     src: 'assets/images/gallery-grid/img-grd-gal-3.jpg',
  //     title: 'Microphone',
  //     size: 'PNG-150KB'
  //   }
  // ];

  ngOnInit() {
    console.log("date>>>",this.date_range);
    this.getActiveHotels();
    this.profitMarginFun({
      port: this.selectedPort,
      hotelId: this.selectedHotel,
      startDate: '',
      endDate: ''
    });
    this.getDashBoardDataFun({
      "port": this.selectedPort,
      "hotelId": this.selectedHotel,
      "airline": this.selectedAirline,
      "startDate": '',
      "endDate": '',
    });

    this.getOpertaionalDataFun({
        "port": this.selectedPort,
        "hotelId": this.selectedHotel,
        "airline": this.selectedAirline,
        "startDate": '',
        "endDate": ''
      });
    this.RevenueBreakdownFun({
      port: this.selectedPort,
      hotelId: this.selectedHotel,
      airline: this.selectedAirline,
      startDate: '',
      endDate: ''
    });
    this.getAllAirlines();
    this.getAllPorts();
    this.RevenueTrendsFun({
      port: this.selectedPort,
      hotelId: this.selectedHotel,
      airline: this.selectedAirline,
      startDate: '',
      endDate: ''
    });
    const startOfYear = moment().startOf('year'); // 1st Jan of current year
    const today = moment();
    this.date_range.startDate = startOfYear;
    this.date_range.endDate = today;
    this.start_date = "";
    this.end_date = "";
    this.timezone = "";

    // this.date_range = null; // Clears the selected date range
  }

  //function start
  dateChangeFun() {
    if (this.date_range && this.date_range != undefined) {
      if (this.date_range.startDate != null) {
        this.start_date = this.datePipe.transform(
          this.date_range.startDate.tz(this.timezone)._d,
          "yyyy-MM-dd"
        );
        this.end_date = this.datePipe.transform(
          this.date_range.endDate.tz(this.timezone)._d,
          "yyyy-MM-dd"
        );
        this.start_date = moment(this.start_date, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
        this.end_date = moment(this.end_date, "YYYY-MM-DD").format(
          "YYYY-MM-DD"
        );
      } else {
        this.start_date = "";
      }
    }
  }

  // Apply filters logic
  applyFilters(): void {
    let start, end;
    if (
      this.date_range.startDate &&
      this.date_range.startDate != "" &&
      this.date_range.endDate &&
      this.date_range.endDate != ""
    ) {
      start = this.datePipe.transform(this.date_range.startDate, "yyyy-MM-dd");
      end = this.datePipe.transform(this.date_range.endDate, "yyyy-MM-dd");
    } else {
      start = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD");
      end = moment(new Date(), "YYYY-MM-DD").format("YYYY-MM-DD");
    }
    const filters = {
      port: this.selectedPort,
      hotelId: this.selectedHotel,
      airline: this.selectedAirline,
      startDate: start,
      endDate: end
    };
    this.getDashBoardDataFun(filters);
    this.getOpertaionalDataFun(filters);
    this.RevenueBreakdownFun(filters);
    this.RevenueTrendsFun(filters);
    this.profitMarginFun(filters);
    // this.revenueBreakdownFun(filters);
    // forkJoin({
    //   dashboardData: this.api.getDashboardData(filters),
    //   operationalData: this.api.getOperationalData(filters),
    //   revenueGraph: this.api.revenueBreakdown(filters),
    //   RevenueData: this.api.revenueTrends(filters),
    //   MarginData: this.api.profitMargin(filters)
    // }).subscribe((res) => {
    //   this.dashboardData = res.dashboardData
    //   this.RevenueData = res.RevenueData
    //   this.operationalData = res.operationalData
    //   this.revenueGraph = res.revenueGraph
    //   this.MarginData = res.MarginData

    //   // Manually trigger change detection
    //   this.cdr.detectChanges();

    //   console.log(this.dashboardData, "dashboardData");
    //   console.log(this.RevenueData, "RevenueData");
    //   console.log(this.operationalData, "operationalData");
    //   console.log(this.revenueGraph, "revenueGraph");

    // }, (error) => {
    //   console.error('Error fetching data:', error)
    // });
  }

  // Reset filters logic
  resetFilters(): void {
    this.date_range = {
      startDate: dayjs().startOf('year'),
      endDate: dayjs()
    };
    
    this.selectedPort=null;
    this.selectedAirline=null;
    this.selectedHotel=null;

    const filters = {
      port: this.selectedPort,
      hotelId: this.selectedHotel,
      airline: this.selectedAirline,
      startDate: '',
      endDate: ''
    };
    this.getDashBoardDataFun(filters);
    this.getOpertaionalDataFun(filters);
    this.RevenueBreakdownFun(filters);
    this.RevenueTrendsFun(filters);
    this.profitMarginFun(filters);
  }

  async RevenueTrendsFun(data:any) {
     // let data = {
      //   port: this.selectedPort,
      //   hotelId: this.selectedHotel,
      //   airline: this.selectedAirline,
      //   startDate: '',
      //   endDate: ''
      // }
    try {
      const ele = await this.api.revenueTrends(data).toPromise();
      if (ele.data) {
        this.RevenueData = ele.data;

        this.chartOptions = {
          chart: {
            height: 300,
            type: 'line',
            toolbar: {
              show: false
            }
          },
          dataLabels: {
            enabled: false
          },
          stroke: {
            width: 2,
            curve: 'smooth'
          },
          series: [
            {
              name: 'Current Year',
              data: this.RevenueData.currentYearData
            },
            {
              name: 'Last Year',
              data: this.RevenueData.lastYearData
            }
          ],
          legend: {
            position: 'top'
          },
          xaxis: {
            // type: 'datetime',
            categories: this.RevenueData.labels,
            axisBorder: {
              show: false
            }
          },
          // yaxis: {
          //   show: true,
          //   min: 10,
          //   max: 70
          // },
          colors: ['#73b4ff', '#59e0c5'],
          fill: {
            type: 'gradient',
            gradient: {
              shade: 'light',
              gradientToColors: ['#0D213A', '#6EC1E4'],
              shadeIntensity: 0.5,
              type: 'horizontal',
              opacityFrom: 1,
              opacityTo: 1,
              stops: [0, 100]
            }
          },
          grid: {
            borderColor: '#cccccc3b'
          },
          markers: {
            size: 4
          }
        };
      } else {
        console.error("No data received from revenue API");
        this.RevenueData = [];
      }
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      this.RevenueData = [];
    }
  }

  async getDashBoardDataFun(data: any) {
    try {
      const res = await this.api.getDashboardData(data).toPromise();
      if (res.data) {
        this.dashboardData = res.data;
        this.chartOptions_1.series = [
          this.dashboardData.totalProfit || 0,
          this.dashboardData.totalCost || 0
        ];
      } else {
        console.error("No data received from dashboard API");
        this.dashboardData = [];
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      this.dashboardData = [];
    }
  }

  getOpertaionalDataFun(data: any) {
    // let data = {
    //   port: this.selectedPort,
    //   hotelId: this.selectedHotel,
    //   airline: this.selectedAirline,
    //   startDate: '',
    //   endDate: ''
    // }
    this.api.getOperationalData(data).subscribe((res: any) => {
      if (res.data) {
        this.operationalData = res.data.length ? res.data : [{}];
      } else {
        console.error("No data received from operational API");
        this.operationalData = [];
      }
    }, (error: any) => {
      console.error('Error fetching data', error);
      this.operationalData = [];
    }
    )
  }

  RevenueBreakdownFun(data:any) {
    // let data = {
    //   port: this.selectedPort,
    //   hotelId: this.selectedHotel,
    //   airline: this.selectedAirline,
    //   startDate: '',
    //   endDate: ''
    // }
    this.api.revenueBreakdown(data).subscribe((res: any) => {
      if (res.data) {

        this.revenueGraph = res.data;

        if (this.revenueGraph) {
          // Dynamically update the Pie Chart data
          let hotelNames = res.data.map((item: any) => `${item.hotel_name} - €${item.revenueamt}`);
          let revenueAmounts = res.data.map((item: any) => (item.revenueamt));

          // If all values are 0, set a small default value
          if (revenueAmounts.every((value: any) => value === 0)) {
            hotelNames = ['Hotel A - $1000', 'Hotel B - $1000', 'Hotel C - $1000']
            revenueAmounts = [1000, 1000, 1000];
          }
          // Update Pie Chart Data
          this.pie1CAC.series = revenueAmounts;
          this.pie1CAC.labels = hotelNames;

          this.pie1CAC.tooltip = {
            y: {
              formatter: (value: number) => `${value.toFixed(2)}%`
            }
          }
          this.pie1CAC.dataLabels = {
            enabled: true,
            formatter: (val: number) => `${val.toFixed(2)}%` // Ensure labels also show decimals
          };
        }
      }
    })
  }

  getHotelsData: any[] = [];
  async getActiveHotels() {
    try {
      let data = {
        port: this.selectedPort
      }
      const res = await this._hotelService.getActiveHotels(data).toPromise();
      if (res) {
        this.getHotelsData = res.data;
      } else {
        console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  // getBreakdownHotelsData: any[] = [];
  // async getBreakdownHotels() {
  //   try {
  //     let data = {
  //       port: this.breakdownPort || ''
  //     }
  //     const res = await this._hotelService.getActiveHotels(data).toPromise();
  //     if (res) {
  //       this.getBreakdownHotelsData = res.data;
  //     } else {
  //       console.error("Error: Unable to fetch getUsers. Status Code:", res.status_code);
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //   }
  // }

  getAllAirlinesData: any[] = [];
  async getAllAirlines() {
    try {
      const res = await this._reservationService.airlineList().toPromise();
      if (res) {
        this.getAllAirlinesData = res.data;
      } else {
        console.error("Error: Unable to fetch getAllAirlines. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  getAllPortsData: any[] = [];
  async getAllPorts() {
    try {
      const res = await this._reservationService.portList().toPromise();
      if (res) {
        this.getAllPortsData = res.data;
      } else {
        console.error("Error: Unable to fetch portList. Status Code:", res.status_code);
      }
    } catch (err) {
      console.error("Error:", err);
    }
  }

  profitMarginFun(data:any) {
    // let data = {
    //   port: this.selectedPort,
    //   hotelId: this.selectedHotel,
    //   startDate: '',
    //   endDate: ''
    // };

    this.api.profitMargin(data).subscribe({
      next: (res) => {
        if (res.data) {

          this.MarginData = res.data;

          if (this.MarginData) {
            let hotelNames = res.data.map((item: any) => item.hotel_name); // X-Axis
            let profitPercentages = res.data.map((item: any) => item.profitpercentage.toFixed(2)); // Y-Axis (Profit %)

            // Ensure `bar1CAC` is initialized
            this.bar1CAC = {
              series: [{
                name: "Profit %",
                data: profitPercentages.map(Number) // Convert strings back to numbers
              }],
              chart: {
                type: "bar",
                height: 350
              },
              plotOptions: {
                bar: {
                  horizontal: false,
                  columnWidth: "55%"
                }
              },
              dataLabels: {
                enabled: true,
                formatter: (val: number) => `${val.toFixed(2)}%`
              },
              xaxis: {
                categories: hotelNames
              },
              yaxis: {
                title: {
                  text: "Profit (%)"
                }
              },
              tooltip: {
                y: {
                  formatter: (value: number) => `${value.toFixed(2)}%`
                }
              }
            };
          }
        } else {
          this._toastr.error(res.message || "No data available", 'Error!');
        }
      },
      error: (err) => {
        this._toastr.error(err.message || "Error fetching data", 'Error!');
        console.log(err);
      }
    });
  }

}
