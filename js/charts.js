window.onload = () => {
    loadTakePartials();
    let equityCurve = new EquityCurve();
    equityCurve.reloadData();

    let resizeValue = -1;

    function updateWindowSize() {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;

        if (w < 384) {
            if (resizeValue != 4) {
                resizeValue = 4;
                equityCurve.myChart.destroy();
                equityCurve.ctx.canvas.height = 230;
                equityCurve.createChart();
            }
        } else if (w < 500) {
            if (resizeValue != 3) {
                resizeValue = 3;
                equityCurve.myChart.destroy();
                equityCurve.ctx.canvas.height = 200;
                equityCurve.createChart();
            }
        } else if (w < 775) {
            if (resizeValue != 2) {
                resizeValue = 2;
                equityCurve.myChart.destroy();
                equityCurve.ctx.canvas.height = 170;
                equityCurve.createChart();
            }
        } else if (w < 950) {
            if (resizeValue != 1) {
                resizeValue = 1;
                equityCurve.myChart.destroy();
                equityCurve.ctx.canvas.height = 140;
                equityCurve.createChart();
            }
        } else if (w < 1000) {
            if (resizeValue != 0) {
                resizeValue = 0;
                equityCurve.myChart.destroy();
                equityCurve.ctx.canvas.height = 110;
                equityCurve.createChart();
            }
        }
    }

    window.addEventListener("resize", updateWindowSize);

    updateWindowSize();
};


class EquityCurve {
    constructor() {
        this.elmChartDisplayContainer = document.getElementById("chartDisplay");
        this.elmChartDisplayLoading = document.getElementById("chartLoadingDisplay");
        this.ctx = document.getElementById('myChart').getContext('2d');

        this.myChart = null;
        this.chartLabels = [];
        this.chartData = [];
        this.createChart();
    }

    showChartSection() {
        this.elmChartDisplayContainer.style.display = "block";
        this.elmChartDisplayLoading.style.display = "none";
    }

    hideChartSection() {
        this.elmChartDisplayContainer.style.display = "none";
        this.elmChartDisplayLoading.style.display = "flex";
    }

    reloadData() {
        this.hideChartSection();

        sendGetRequest("/api/getEquityCurve")
            .then(json => {
                if (json.status == 'success') {
                    // clear the stat data
                    this.chartLabels.splice(0, this.chartLabels.length);
                    this.chartData.splice(0, this.chartData.length);

                    json.stats.forEach(stat => {
                        this.chartLabels.push(stat.label);
                        this.chartData.push(stat.value);
                    });

                    this.myChart.data.datasets[0].label = json.label;

                    this.myChart.update();

                    this.showChartSection();
                } else {
                    console.log("Failed to get stats");
                    //this.updateInterval(startDate, endDate);
                }
            }).catch(err => {
                console.error(err);
                //this.updateInterval(startDate, endDate);
            });
    }

    createChart() {
        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: 'Visitors',
                    fill: true, // fill the background color under the chart
                    data: this.chartData,
                    tension: 0,
                    backgroundColor: chartBackgroundColor,
                    borderColor: chartBorderColor,
                    borderWidth: 1 // border width of the chart
                }]
            },
            options: {
                interaction: { //tooltip appears on hovering over chart
                    mode: 'index',
                    intersect: false
                },
                plugins: { // remove the dataset label
                    legend: {
                        display: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: true,
                            color: "rgba(200, 200, 200, 0.3)"
                        }
                    },
                    x: { // remove the vertical grid lines
                        grid: {
                            display: false
                        }
                    }
                },
                elements: { //remove the dot on the line
                    point: {
                        radius: 0
                    }
                }
            }
        });
    }
}