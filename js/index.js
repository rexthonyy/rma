window.onload = () => {
    const dashboard = new Dashboard();
    new ProfileSelector(0, dashboard);

    let resizeValue = -1;

    function updateWindowSize() {
        var w = document.documentElement.clientWidth;
        var h = document.documentElement.clientHeight;

        if (w < 384) {
            if (resizeValue != 4) {
                resizeValue = 4;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 300;
                dashboard.createChart();
            }
        } else if (w < 500) {
            if (resizeValue != 3) {
                resizeValue = 3;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 260;
                dashboard.createChart();
            }
        } else if (w < 775) {
            if (resizeValue != 2) {
                resizeValue = 2;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 240;
                dashboard.createChart();
            }
        } else if (w < 950) {
            if (resizeValue != 1) {
                resizeValue = 1;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 240;
                dashboard.createChart();
            }
        } else if (w < 1000) {
            if (resizeValue != 0) {
                resizeValue = 0;
                dashboard.myChart.destroy();
                dashboard.ctx.canvas.height = 240;
                dashboard.createChart();
            }
        }
    }

    window.addEventListener("resize", updateWindowSize);

    updateWindowSize();
};

class Dashboard {
    constructor() {
        this.mainDisplay = document.getElementById("mainDisplayID");
        this.loadingDisplay = document.getElementById("loadingDisplayID");
        this.ctx = document.getElementById('myChart').getContext('2d');
        this.dataContainer = document.getElementById("dataContainer");
        this.summaryContainer = document.getElementById("summaryContainer");
        this.rawContainer = document.getElementById("rawContainer");

        this.myChart = null;
        this.chartLabels = [];
        this.chartData = [];
        this.createChart();
    }

    createChart() {
        this.myChart = new Chart(this.ctx, {
            type: 'line',
            data: {
                labels: this.chartLabels,
                datasets: [{
                    label: 'Dollars ($)',
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
                        beginAtZero: false,
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
                },
                animation: {
                    duration: 0
                }
            }
        });
    }

    hide() {
        this.mainDisplay.style.display = "none";
        this.loadingDisplay.style.display = "flex";
    }

    hideAll() {
        this.mainDisplay.style.display = "none";
        this.loadingDisplay.style.display = "none";
    }

    show() {
        this.mainDisplay.style.display = "block";
        this.loadingDisplay.style.display = "none";
    }

    updateData(data) {
        let html = "";
        let length = data.length;

        for (let i = 0; i < length; i++) {
            if (i > 0) {
                html += ",";
            }
            html += data[i] === true ? "win" : "loss";
        }
        html += "";
        this.dataContainer.innerHTML = html;
    }

    updateChart(data) {
        // clear the stat data
        this.chartLabels.splice(0, this.chartLabels.length);
        this.chartData.splice(0, this.chartData.length);

        data.forEach(entry => {
            this.chartLabels.push(entry.label);
            this.chartData.push(entry.value);
        });

        this.myChart.update();
    }

    updateSummary(data) {
        let html = "";
        data.forEach(entry => {
            let changeElm = "";
            if (entry.change) {
                if (entry.change >= 0) {
                    changeElm = `<span class="rex-fs-x-small rex-color-green-pure">${numberWithCommas(entry.change)}%</span>`;
                } else {
                    changeElm = `<span class="rex-fs-x-small rex-color-red-pure">${numberWithCommas(entry.change)}%</span>`;
                }
            }

            html += `
                <div class="custom-background-level-2 rex-curDiv-8px rex-border-darkgray rex-pad8px">
                    <p class="rex-fs-small rex-color-darkgray">${entry.title}</p>
                    <div class="rex-mt-8px rex-weight-bold">
                        <span class="rex-fs-normal rex-color-white rex-mr-8px">${entry.value}</span>
                        ${changeElm}
                    </div>
                </div>
            `;
        });

        this.summaryContainer.innerHTML = html;
    }

    updateRaw(data) {
        let html = "";
        data.forEach(entry => {
            let backgroundElm = "<div>";
            let statusColorElm = "rex-color-green-pure";

            if (entry.trade % 2 != 0) {
                backgroundElm = `<div class="custom-background-level-2 rex-width-max-content">`;
            }

            if (entry.win == false) {
                statusColorElm = "rex-color-red-pure";
            }

            html += `
            ${backgroundElm}
                <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.trade}</div>
                <div class="${statusColorElm} rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px rex-fs-normal rex-border-right-darkgray">${entry.win == true ? "win":"loss"}</div>
                <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.risk}</div>
                <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.profit}</div>
                <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.balance}</div>
            </div>
            `;
        });

        this.rawContainer.innerHTML = html;
    }
}

class ProfileSelector {
    constructor(initialIndex, dashboard) {
        this.profileSelector = document.getElementById("profileSelectorID");
        this.generateButton = document.getElementById("generateBtnID");

        this.profileOptionValues = ["manual", "optimal", "conservative", "retail", "aggressive"];

        this.profiles = [
            new ProfileManual(new ManualDashboardInputHandler(dashboard)),
            new ProfileOptimal(new OptimalDashboardInputHandler(dashboard)),
            new ProfileConservative(new ConservativeDashboardInputHandler(dashboard)),
            new ProfileRetail(new RetailDashboardInputHandler(dashboard)),
            new ProfileAggressive(new AggressiveDashboardInputHandler(dashboard))
        ];

        this.profileSelector.onchange = e => {
            let profileValue = e.target.value;
            this.profileChangeListener(profileValue);
        };

        let profileValue = this.profileOptionValues[initialIndex];
        this.profileSelector.value = profileValue;
        this.profileChangeListener(profileValue);

        this.generateButton.onclick = () => {
            profileValue = this.profileSelector.value;
            this.profiles[this.profileOptionValues.indexOf(profileValue)].generate();
        };
    }

    profileChangeListener(profileValue) {
        this.profiles.forEach(profile => {
            profile.hideControl();
        });

        this.profiles[this.profileOptionValues.indexOf(profileValue)].showControl();
    }
}

class Profile {
    constructor(dashboardInputHandler, controls) {
        this.dashboardInputHandler = dashboardInputHandler;
        this.controls = controls;
        this.dataElm = document.getElementById("dataID");
        this.startingBalanceElm = document.getElementById("startingBalanceID");
        this.winRateElm = document.getElementById("winRateID");
        this.rewardToRiskRatioElm = document.getElementById("rewardToRiskRatioID");
        this.numTradesElm = document.getElementById("numTradesID");
    }

    hideControl() {
        this.controls.forEach(control => {
            control.style.display = "none";
        });
    }

    showControl() {
        this.controls.forEach(control => {
            control.style.display = "block";
        });
    }

    getInput() {
        let input = { isOkay: true };

        let dataVar = this.dataElm.value;
        let startingBalanceVar = this.startingBalanceElm.value;
        let winRateVar = this.winRateElm.value;
        let rewardToRiskRatioVar = this.rewardToRiskRatioElm.value;
        let numTradesVar = this.numTradesElm.value;

        if (input.isOkay) {
            if (dataVar) {
                let dataStringArr = dataVar.split(",");
                input.data = [];
                dataStringArr.forEach(entry => {
                    input.data.push(entry == 'win');
                });
            } else {
                input.data = undefined;
            }
        }

        if (input.isOkay) {
            if (startingBalanceVar) {
                startingBalanceVar = parseFloat(startingBalanceVar);
                if (startingBalanceVar > 0) {
                    input.startingBalance = startingBalanceVar;
                } else {
                    input.isOkay = false;
                    input.message = "Starting Balance must be greater than 0";
                }
            } else {
                input.isOkay = false;
                input.message = "Starting Balance is invalid";
            }
        }

        if (input.isOkay) {
            if (winRateVar) {
                winRateVar = parseFloat(winRateVar);
                if (winRateVar >= 0 && winRateVar <= 100) {
                    input.winRate = winRateVar;
                } else {
                    input.isOkay = false;
                    input.message = "Win rate % must be a positive number less than or equal to 100";
                }
            } else {
                input.isOkay = false;
                input.message = "Win rate % is invalid";
            }
        }

        if (input.isOkay) {
            if (rewardToRiskRatioVar) {
                rewardToRiskRatioVar = parseFloat(rewardToRiskRatioVar);
                if (rewardToRiskRatioVar >= 0) {
                    input.rewardToRiskRatio = rewardToRiskRatioVar;
                } else {
                    input.isOkay = false;
                    input.message = "Reward to risk ratio must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Reward to risk ratio is invalid";
            }
        }

        if (input.isOkay) {
            if (numTradesVar) {
                numTradesVar = parseInt(numTradesVar);
                if (numTradesVar >= 0) {
                    input.numTrades = numTradesVar;
                } else {
                    input.isOkay = false;
                    input.message = "The number of trades must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "The number of trades is invalid";
            }
        }

        return input;
    }
}

class ProfileManual extends Profile {
    constructor(dashboardInputHandler) {
        super(dashboardInputHandler, [document.getElementById("manualControlsID")]);
        this.riskPerTradeElm = document.getElementById("riskPerTradeDollarID");
        this.resetBtnElm = document.getElementById("resetBtnID");

        this.resetBtnElm.onclick = e => {
            dashboardInputHandler.resetTradingResults();
            dashboardInputHandler.dashboard.hideAll();
        };
    }

    getInput() {
        let input = super.getInput();

        let riskPerTradeVar = this.riskPerTradeElm.value;

        if (input.isOkay) {
            if (riskPerTradeVar) {
                riskPerTradeVar = parseFloat(riskPerTradeVar);
                if (riskPerTradeVar >= 0) {
                    input.riskPerTrade = riskPerTradeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk per trade $ must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk per trade $ is invalid";
            }
        }

        return input;
    }

    generate() {
        let input = this.getInput();
        if (!input.isOkay) return alert(input.message);
        this.dashboardInputHandler.generate(input);
    }
}

class ProfileOptimal extends Profile {
    constructor(dashboardInputHandler) {
        super(dashboardInputHandler, [document.getElementById("conservativeControlsID"), document.getElementById("commonControlsID"), document.getElementById("optimalControlsID")]);
        this.riskPerTradeElm = document.getElementById("riskPerTradeID");
        this.drawdownMitigationProfitIntervalElm = document.getElementById("drawdownMitigationProfitIntervalID");
        this.conservativeTypeElm = document.getElementById("conservativeTypeID");
        this.initialRiskPerTradeElm = document.getElementById("initialRiskPerTradeID");
        this.minRiskPerTradeThrottleElm = document.getElementById("minRiskPerTradeThrottleID");
        this.maxRiskPerTradeThrottleElm = document.getElementById("maxRiskPerTradeThrottleID");
        this.riskIncrementMultiplierElm = document.getElementById("riskIncrementMultiplierID");
        this.riskIncrementIntervalElm = document.getElementById("riskIncrementIntervalID");
        this.lockInProfitIntervalElm = document.getElementById("lockInProfitIntervalID");
    }

    getInput() {
        let input = super.getInput();

        let riskPerTradeVar = this.riskPerTradeElm.value;
        let drawdownMitigationProfitIntervalVar = this.drawdownMitigationProfitIntervalElm.value;
        let conservativeTypeVar = this.conservativeTypeElm.value;
        let initialRiskPerTradeVar = this.initialRiskPerTradeElm.value;
        let minRiskPerTradeThrottleVar = this.minRiskPerTradeThrottleElm.value;
        let maxRiskPerTradeThrottleVar = this.maxRiskPerTradeThrottleElm.value;
        let riskIncrementMultiplierVar = this.riskIncrementMultiplierElm.value;
        let riskIncrementIntervalVar = this.riskIncrementIntervalElm.value;
        let lockInProfitIntervalVar = this.lockInProfitIntervalElm.value;

        if (input.isOkay) {
            if (riskPerTradeVar) {
                riskPerTradeVar = parseFloat(riskPerTradeVar);
                if (riskPerTradeVar >= 0 && riskPerTradeVar <= 100) {
                    input.riskPerTrade = riskPerTradeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk per trade % must be a positive number less than 100";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk per trade % is invalid";
            }
        }

        if (input.isOkay) {
            if (drawdownMitigationProfitIntervalVar) {
                drawdownMitigationProfitIntervalVar = parseFloat(drawdownMitigationProfitIntervalVar);
                if (drawdownMitigationProfitIntervalVar >= 0) {
                    input.drawdownMitigationProfitInterval = drawdownMitigationProfitIntervalVar;
                } else {
                    input.isOkay = false;
                    input.message = "Drawdown mitigation profit interval must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Drawdown mitigation profit interval is invalid";
            }
        }

        if (input.isOkay) {
            if (conservativeTypeVar) {
                if (["gradual", "aggressive", "minimizedrawdown"].findIndex(a => a == conservativeTypeVar) != -1) {
                    input.conservativeType = conservativeTypeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Conservative type must be either 'Gradual', 'Aggressive' or 'Minimize Drawdown";
                }
            } else {
                input.isOkay = false;
                input.message = "Conservative type is invalid";
            }
        }

        if (input.isOkay) {
            if (initialRiskPerTradeVar) {
                initialRiskPerTradeVar = parseFloat(initialRiskPerTradeVar);
                if (initialRiskPerTradeVar >= 0) {
                    input.initialRiskPerTrade = initialRiskPerTradeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Initial risk per trade % must be a positive number";
                }
            } else {
                input.initialRiskPerTrade = undefined;
            }
        }

        if (input.isOkay) {
            if (minRiskPerTradeThrottleVar) {
                minRiskPerTradeThrottleVar = parseFloat(minRiskPerTradeThrottleVar);
                if (minRiskPerTradeThrottleVar >= 0) {
                    input.minRiskPerTradeThrottle = minRiskPerTradeThrottleVar;
                } else {
                    input.isOkay = false;
                    input.message = "Min risk per trade % throttle must be a positive number";
                }
            } else {
                input.minRiskPerTradeThrottle = undefined;
            }
        }

        if (input.isOkay) {
            if (maxRiskPerTradeThrottleVar) {
                maxRiskPerTradeThrottleVar = parseFloat(maxRiskPerTradeThrottleVar);
                if (maxRiskPerTradeThrottleVar >= 0) {
                    input.maxRiskPerTradeThrottle = maxRiskPerTradeThrottleVar;
                } else {
                    input.isOkay = false;
                    input.message = "Max risk per trade % throttle must be a positive number";
                }
            } else {
                input.maxRiskPerTradeThrottle = undefined;
            }
        }

        if (input.isOkay) {
            if (riskIncrementMultiplierVar) {
                riskIncrementMultiplierVar = parseFloat(riskIncrementMultiplierVar);
                if (riskIncrementMultiplierVar >= 0) {
                    input.riskIncrementMultiplier = riskIncrementMultiplierVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk increment multiplier must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk increment multiplier is invalid";
            }
        }

        if (input.isOkay) {
            if (riskIncrementIntervalVar) {
                riskIncrementIntervalVar = parseInt(riskIncrementIntervalVar);
                if (riskIncrementIntervalVar >= 0) {
                    input.riskIncrementInterval = riskIncrementIntervalVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk increment interval must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk increment interval is invalid";
            }
        }

        if (input.isOkay) {
            if (lockInProfitIntervalVar) {
                lockInProfitIntervalVar = parseFloat(lockInProfitIntervalVar);
                if (lockInProfitIntervalVar >= 0) {
                    input.lockInProfitInterval = lockInProfitIntervalVar;
                } else {
                    input.isOkay = false;
                    input.message = "Lock-in profit interval must be a positive number";
                }
            } else {
                input.lockInProfitInterval = undefined;
            }
        }

        return input;
    }

    generate() {
        let input = this.getInput();
        if (!input.isOkay) return alert(input.message);
        this.dashboardInputHandler.generate(input);
    }
}

class ProfileConservative extends Profile {
    constructor(dashboardInputHandler) {
        super(dashboardInputHandler, [document.getElementById("conservativeControlsID")]);
        this.conservativeTypeElm = document.getElementById("conservativeTypeID");
        this.initialRiskPerTradeElm = document.getElementById("initialRiskPerTradeID");
        this.minRiskPerTradeThrottleElm = document.getElementById("minRiskPerTradeThrottleID");
        this.maxRiskPerTradeThrottleElm = document.getElementById("maxRiskPerTradeThrottleID");
        this.riskIncrementMultiplierElm = document.getElementById("riskIncrementMultiplierID");
        this.riskIncrementIntervalElm = document.getElementById("riskIncrementIntervalID");
        this.lockInProfitIntervalElm = document.getElementById("lockInProfitIntervalID");
    }

    getInput() {
        let input = super.getInput();

        let conservativeTypeVar = this.conservativeTypeElm.value;
        let initialRiskPerTradeVar = this.initialRiskPerTradeElm.value;
        let minRiskPerTradeThrottleVar = this.minRiskPerTradeThrottleElm.value;
        let maxRiskPerTradeThrottleVar = this.maxRiskPerTradeThrottleElm.value;
        let riskIncrementMultiplierVar = this.riskIncrementMultiplierElm.value;
        let riskIncrementIntervalVar = this.riskIncrementIntervalElm.value;
        let lockInProfitIntervalVar = this.lockInProfitIntervalElm.value;

        if (input.isOkay) {
            if (conservativeTypeVar) {
                if (["gradual", "aggressive", "minimizedrawdown"].findIndex(a => a == conservativeTypeVar) != -1) {
                    input.conservativeType = conservativeTypeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Conservative type must be either 'Gradual', 'Aggressive' or 'Minimize Drawdown";
                }
            } else {
                input.isOkay = false;
                input.message = "Conservative type is invalid";
            }
        }

        if (input.isOkay) {
            if (initialRiskPerTradeVar) {
                initialRiskPerTradeVar = parseFloat(initialRiskPerTradeVar);
                if (initialRiskPerTradeVar >= 0) {
                    input.initialRiskPerTrade = initialRiskPerTradeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Initial risk per trade % must be a positive number";
                }
            } else {
                input.initialRiskPerTrade = undefined;
            }
        }

        if (input.isOkay) {
            if (minRiskPerTradeThrottleVar) {
                minRiskPerTradeThrottleVar = parseFloat(minRiskPerTradeThrottleVar);
                if (minRiskPerTradeThrottleVar >= 0) {
                    input.minRiskPerTradeThrottle = minRiskPerTradeThrottleVar;
                } else {
                    input.isOkay = false;
                    input.message = "Min risk per trade % throttle must be a positive number";
                }
            } else {
                input.minRiskPerTradeThrottle = undefined;
            }
        }

        if (input.isOkay) {
            if (maxRiskPerTradeThrottleVar) {
                maxRiskPerTradeThrottleVar = parseFloat(maxRiskPerTradeThrottleVar);
                if (maxRiskPerTradeThrottleVar >= 0) {
                    input.maxRiskPerTradeThrottle = maxRiskPerTradeThrottleVar;
                } else {
                    input.isOkay = false;
                    input.message = "Max risk per trade % throttle must be a positive number";
                }
            } else {
                input.maxRiskPerTradeThrottle = undefined;
            }
        }

        if (input.isOkay) {
            if (riskIncrementMultiplierVar) {
                riskIncrementMultiplierVar = parseFloat(riskIncrementMultiplierVar);
                if (riskIncrementMultiplierVar >= 0) {
                    input.riskIncrementMultiplier = riskIncrementMultiplierVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk increment multiplier must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk increment multiplier is invalid";
            }
        }

        if (input.isOkay) {
            if (riskIncrementIntervalVar) {
                riskIncrementIntervalVar = parseInt(riskIncrementIntervalVar);
                if (riskIncrementIntervalVar >= 0) {
                    input.riskIncrementInterval = riskIncrementIntervalVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk increment interval must be a positive number";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk increment interval is invalid";
            }
        }

        if (input.isOkay) {
            if (lockInProfitIntervalVar) {
                lockInProfitIntervalVar = parseFloat(lockInProfitIntervalVar);
                if (lockInProfitIntervalVar >= 0) {
                    input.lockInProfitInterval = lockInProfitIntervalVar;
                } else {
                    input.isOkay = false;
                    input.message = "Lock-in profit interval must be a positive number";
                }
            } else {
                input.lockInProfitInterval = undefined;
            }
        }

        return input;
    }

    generate() {
        let input = this.getInput();
        if (!input.isOkay) return alert(input.message);
        this.dashboardInputHandler.generate(input);
    }
}

class ProfileRetail extends Profile {
    constructor(dashboardInputHandler) {
        super(dashboardInputHandler, [document.getElementById("commonControlsID")]);
        this.riskPerTradeElm = document.getElementById("riskPerTradeID");
    }

    getInput() {
        let input = super.getInput();

        let riskPerTradeVar = this.riskPerTradeElm.value;

        if (input.isOkay) {
            if (riskPerTradeVar) {
                riskPerTradeVar = parseFloat(riskPerTradeVar);
                if (riskPerTradeVar >= 0 && riskPerTradeVar <= 100) {
                    input.riskPerTrade = riskPerTradeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk per trade % must be a positive number less than 100";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk per trade % is invalid";
            }
        }

        return input;
    }

    generate() {
        let input = this.getInput();
        if (!input.isOkay) return alert(input.message);
        this.dashboardInputHandler.generate(input);
    }
}

class ProfileAggressive extends Profile {
    constructor(dashboardInputHandler) {
        super(dashboardInputHandler, [document.getElementById("commonControlsID")]);
        this.riskPerTradeElm = document.getElementById("riskPerTradeID");
    }

    getInput() {
        let input = super.getInput();

        let riskPerTradeVar = this.riskPerTradeElm.value;

        if (input.isOkay) {
            if (riskPerTradeVar) {
                riskPerTradeVar = parseFloat(riskPerTradeVar);
                if (riskPerTradeVar >= 0 && riskPerTradeVar <= 100) {
                    input.riskPerTrade = riskPerTradeVar;
                } else {
                    input.isOkay = false;
                    input.message = "Risk per trade % must be a positive number less than 100";
                }
            } else {
                input.isOkay = false;
                input.message = "Risk per trade % is invalid";
            }
        }

        return input;
    }

    generate() {
        let input = this.getInput();
        if (!input.isOkay) return alert(input.message);
        this.dashboardInputHandler.generate(input);
    }
}

class DashboardInputHandler {
    constructor(dashboard) {
        this.dashboard = dashboard;
    }

    computeTradesResult(numTrades, winRate) {
        let tradesResult = [];
        for (let i = 0; i < numTrades; i++) {
            tradesResult.push(getRandom(0, 100) <= winRate);
        }
        return tradesResult;
    }

    showDashboard() {
        this.dashboard.show();
    }

    hideDashboard() {
        this.dashboard.hide();
    }

    updateData(tradesData) {
        let data = [];
        tradesData.forEach(trade => {
            data.push(trade.win);
        });
        this.dashboard.updateData(data);
    }

    updateChart(data) {
        this.dashboard.updateChart(data);
    }

    updateSummary(data) {
        this.dashboard.updateSummary(data);
    }

    updateRaw(data) {
        this.dashboard.updateRaw(data);
    }

    getActiveTrades(tradesData) {
        let activeTrades = [];
        let numTrades = tradesData.length;

        // remove trades after account is blown
        for (let i = 0; i < numTrades; i++) {
            let trade = tradesData[i];
            if (trade.win == false && trade.risk == 0 && trade.profit == 0) {
                break;
            } else {
                activeTrades.push(trade);
            }
        };

        return activeTrades;
    }

    generateChartData(startingBalance, tradesData) {
        let activeTrades = this.getActiveTrades(tradesData);

        let chartData = [{
            label: 0,
            value: startingBalance
        }];

        let numTrades = activeTrades.length;

        for (let i = 0; i < numTrades; i++) {
            chartData.push({
                label: i + 1,
                value: activeTrades[i].balance
            });
        }

        return chartData;
    }

    generateChartSummary(startingBalance, tradesData) {

        function computeTradeStatus(tradesData) {
            let numTrades = tradesData.length;
            let isActive = true;
            for (let i = 0; i < numTrades; i++) {
                let trade = tradesData[i];
                if (trade.win == false && trade.risk == 0 && trade.profit == 0) {
                    isActive = false;
                    break;
                }
            };

            return isActive ? "Active" : "Blown";
        }

        function computeTotalTrades(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            return activeTrades.length;
        }

        function computeProfit(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let lastTradeIndex = activeTrades.length - 1
            let endingBalance = activeTrades[lastTradeIndex].balance;
            let profit = parseFloat((endingBalance - startingBalance).toFixed(2));
            let change = percentChange(endingBalance, startingBalance);
            let minEquity = startingBalance;
            let maxEquity = 0;
            activeTrades.forEach(trade => {
                minEquity = Math.min(minEquity, trade.balance);
                maxEquity = Math.max(maxEquity, trade.balance);
            });

            return {
                profit,
                endingBalance,
                change,
                minEquity,
                maxEquity
            };
        }

        function computeWinRate(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let numWins = 0;
            let numTrades = activeTrades.length;

            activeTrades.forEach(trade => {
                if (trade.win == true) {
                    numWins++;
                }
            });

            return parseFloat(((numWins / numTrades) * 100).toFixed(2));
        }

        function computeMaximalDrawdown(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let maxBalance = startingBalance;
            let maxDrawdown = 0;

            activeTrades.forEach(trade => {
                maxBalance = Math.max(maxBalance, trade.balance);
                maxDrawdown = Math.max(maxDrawdown, maxBalance - trade.balance);
            });

            return parseFloat(maxDrawdown.toFixed(2));
        }

        function computeMaximumDrawdownDuration(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let maxBalance = startingBalance;
            let drawdownTradesCounter = 0;
            let maxDrawdownTradeDuration = 0;

            activeTrades.forEach(trade => {
                maxBalance = Math.max(maxBalance, trade.balance);
                if (trade.balance < maxBalance) {
                    drawdownTradesCounter++;
                    maxDrawdownTradeDuration = Math.max(maxDrawdownTradeDuration, drawdownTradesCounter);
                } else {
                    drawdownTradesCounter = 0;
                }
            });

            return maxDrawdownTradeDuration;
        }

        function computeLargestProfitTrade(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let maxProfit = 0;

            activeTrades.forEach(trade => {
                maxProfit = Math.max(maxProfit, trade.profit);
            });

            return maxProfit;
        }

        function computeLargestLossTrade(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let minProfit = 0;

            activeTrades.forEach(trade => {
                minProfit = Math.min(minProfit, trade.profit);
            });

            return Math.abs(minProfit);
        }

        function computeMaximumConsecutiveWins(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let count = 0;
            let profit = 0;
            let counter = 0;
            let profitCounter = 0;

            activeTrades.forEach(trade => {
                if (trade.win == true) {
                    counter++;
                    profitCounter += trade.profit;
                    if (counter > count) {
                        count = counter;
                        profit = profitCounter;
                    }
                } else {
                    counter = 0;
                    profitCounter = 0;
                }
            });

            return {
                count,
                profit: parseFloat(profit.toFixed(2))
            };
        }

        function computeMaximumConsecutiveLosses(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let count = 0;
            let loss = 0;
            let counter = 0;
            let lossCounter = 0;

            activeTrades.forEach(trade => {
                if (trade.win == false) {
                    counter++;
                    lossCounter += trade.profit;
                    if (counter > count) {
                        count = counter;
                        loss = lossCounter;
                    }
                } else {
                    counter = 0;
                    lossCounter = 0;
                }
            });

            return {
                count,
                loss: Math.abs(parseFloat(loss.toFixed(2)))
            };
        }

        function computeMaximalConsecutiveProfit(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let count = 0;
            let profit = 0;
            let counter = 0;
            let profitCounter = 0;

            activeTrades.forEach(trade => {
                if (trade.win == true) {
                    counter++;
                    profitCounter += trade.profit;
                    if (profitCounter > profit) {
                        count = counter;
                        profit = profitCounter;
                    }
                } else {
                    counter = 0;
                    profitCounter = 0;
                }
            });

            return {
                count,
                profit: parseFloat(profit.toFixed(2))
            };
        }

        function computeMaximalConsecutiveLoss(_this, tradesData) {
            let activeTrades = _this.getActiveTrades(tradesData);
            let count = 0;
            let loss = 0;
            let counter = 0;
            let lossCounter = 0;

            activeTrades.forEach(trade => {
                if (trade.win == false) {
                    counter++;
                    lossCounter += trade.profit;
                    if (lossCounter < loss) {
                        count = counter;
                        loss = lossCounter;
                    }
                } else {
                    counter = 0;
                    lossCounter = 0;
                }
            });

            return {
                count,
                loss: Math.abs(parseFloat(loss.toFixed(2)))
            };
        }

        let profitObj = computeProfit(this, tradesData);
        let maximumConsecutiveWinsObj = computeMaximumConsecutiveWins(this, tradesData);
        let maximumConsecutiveLossesObj = computeMaximumConsecutiveLosses(this, tradesData);
        let maximalConsecutiveProfitObj = computeMaximalConsecutiveProfit(this, tradesData);
        let maximalConsecutiveLossObj = computeMaximalConsecutiveLoss(this, tradesData);

        return [{
            title: "Status",
            value: computeTradeStatus(tradesData)
        }, {
            title: "Total trades",
            value: numberWithCommas(computeTotalTrades(this, tradesData))
        }, {
            title: "Win rate %",
            value: computeWinRate(this, tradesData) + "%"
        }, {
            title: "Balance",
            value: "$" + numberWithCommas(profitObj.endingBalance)
        }, {
            title: "Lowest balance",
            value: "$" + numberWithCommas(profitObj.minEquity)
        }, {
            title: "Highest balance",
            value: "$" + numberWithCommas(profitObj.maxEquity)
        }, {
            title: "Profit",
            value: (profitObj.profit > 0 ? "" : "-") + "$" + numberWithCommas(Math.abs(profitObj.profit)),
            change: profitObj.change
        }, {
            title: "Maximal drawdown",
            value: "-$" + numberWithCommas(computeMaximalDrawdown(this, tradesData))
        }, {
            title: "Maximum drawdown duration",
            value: numberWithCommas(computeMaximumDrawdownDuration(this, tradesData)) + " trades"
        }, {
            title: "Largest profit trade",
            value: "$" + numberWithCommas(computeLargestProfitTrade(this, tradesData))
        }, {
            title: "Largest loss trade",
            value: "-$" + numberWithCommas(computeLargestLossTrade(this, tradesData))
        }, {
            title: "Maximum consecutive wins",
            value: numberWithCommas(maximumConsecutiveWinsObj.count) + " ($" + numberWithCommas(maximumConsecutiveWinsObj.profit) + ")"
        }, {
            title: "Maximum consecutive losses",
            value: numberWithCommas(maximumConsecutiveLossesObj.count) + " (-$" + numberWithCommas(maximumConsecutiveLossesObj.loss) + ")"
        }, {
            title: "Maximal consecutive profit (count)",
            value: "$" + numberWithCommas(maximalConsecutiveProfitObj.profit) + " (" + numberWithCommas(maximalConsecutiveProfitObj.count) + ")"
        }, {
            title: "Maximal consecutive loss (count)",
            value: "-$" + numberWithCommas(maximalConsecutiveLossObj.loss) + " (" + numberWithCommas(maximalConsecutiveLossObj.count) + ")"
        }];
    }

    generateRawData(startingBalance, tradesData) {
        let activeTrades = this.getActiveTrades(tradesData);
        let rawData = [{
            trade: 0,
            win: true,
            risk: 0,
            profit: 0,
            balance: numberWithCommas(startingBalance)
        }];

        let numTrades = activeTrades.length;

        for (let i = 0; i < numTrades; i++) {
            rawData.push({
                trade: i + 1,
                win: activeTrades[i].win,
                risk: numberWithCommas(activeTrades[i].risk),
                profit: numberWithCommas(activeTrades[i].profit),
                balance: numberWithCommas(activeTrades[i].balance)
            });
        }

        return rawData;
    }
}

class ManualDashboardInputHandler extends DashboardInputHandler {
    constructor(dashboard) {
        super(dashboard);
        this.numTradesElm = document.getElementById("numTradesID");
        this.tradesResult = [];
        this.numGenerateClick = 0;
        this.resetTradingResults();
    }

    resetTradingResults() {
        this.tradesResult = [];
        this.numTradesElm.value = 0;
        this.numGenerateClick = 0;
    }

    updateUI() {
        this.numTradesElm.value = this.numGenerateClick;
    }

    generate(input) {
        super.hideDashboard();
        let tradesData = this.computeTradesData(input);
        super.updateData(tradesData);
        super.updateChart(super.generateChartData(input.startingBalance, tradesData));
        super.updateSummary(super.generateChartSummary(input.startingBalance, tradesData));
        super.updateRaw(super.generateRawData(input.startingBalance, tradesData));
        super.showDashboard();
    }

    computeTradesData(input) {
        this.numGenerateClick++;

        if (input.data == undefined) {
            this.tradesResult.push({
                isWin: super.computeTradesResult(11, input.winRate)[Math.floor(getRandom(0, 10))],
                risk: parseFloat(input.riskPerTrade.toFixed(2)),
                rewardToRiskRatio: input.rewardToRiskRatio
            });
        } else {
            if (this.numGenerateClick <= input.data.length) {
                this.tradesResult.push({
                    isWin: input.data[this.numGenerateClick - 1],
                    risk: parseFloat(input.riskPerTrade.toFixed(2)),
                    rewardToRiskRatio: input.rewardToRiskRatio
                });
            } else {
                this.tradesResult.push({
                    isWin: super.computeTradesResult(11, input.winRate)[Math.floor(getRandom(0, 10))],
                    risk: parseFloat(input.riskPerTrade.toFixed(2)),
                    rewardToRiskRatio: input.rewardToRiskRatio
                });
            }
        }

        let tradesData = [];
        let balance = input.startingBalance;
        let win, risk, profit;

        this.tradesResult.forEach(result => {
            win = result.isWin;

            // calculate the risk
            risk = result.risk;

            // calculate pnl
            if (risk <= balance) {
                profit = win == true ? parseFloat((risk * result.rewardToRiskRatio).toFixed(2)) : -1 * risk;
            } else {
                // blown account
                win = false;
                risk = 0;
                profit = 0;
            }

            // calculate balance
            balance = parseFloat((balance + profit).toFixed(2));

            tradesData.push({ win, risk, profit, balance });
        });

        this.updateUI();

        return tradesData;
    }
}

class OptimalDashboardInputHandler extends DashboardInputHandler {
    constructor(dashboard) {
        super(dashboard);
    }

    generate(input) {
        super.hideDashboard();
        let tradesData = this.computeTradesData(input);
        super.updateData(tradesData);
        super.updateChart(super.generateChartData(input.startingBalance, tradesData));
        super.updateSummary(super.generateChartSummary(input.startingBalance, tradesData));
        super.updateRaw(super.generateRawData(input.startingBalance, tradesData));
        super.showDashboard();
    }

    computeTradesData(input) {
        let tradesResult = input.data;
        if (tradesResult == undefined) {
            tradesResult = super.computeTradesResult(input.numTrades, input.winRate);
        }

        let tradesData = [];
        let balance = input.startingBalance;
        let lastBalance = balance;
        let maxBalance = balance;
        let incrementCounter = 0;
        let isLockInProfit = false;
        let isAboveDrawdownMitigationProfitInterval = true;
        let drawdownMitigationProfitIndex = 0;
        let win, risk, profit, lastTrade;

        tradesResult.forEach(result => {
            win = result;

            // calculate the risk
            if (isAboveDrawdownMitigationProfitInterval == true) {
                risk = parseFloat((input.riskPerTrade * balance / 100).toFixed(2));
            } else {
                if (lastTrade.win == true) {
                    if (isLockInProfit == true) {
                        incrementCounter = 0;
                        risk = input.minRiskPerTradeThrottle != undefined ? parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2)) : 1;
                        if (risk < 1) {
                            risk = 1;
                        }
                    } else {
                        incrementCounter++;
                        if (incrementCounter >= input.riskIncrementInterval) {
                            incrementCounter = 0;
                            risk = lastTrade.risk * input.riskIncrementMultiplier;
                        }

                        if (input.conservativeType == "minimizedrawdown") {
                            if (balance < maxBalance) {
                                risk = input.minRiskPerTradeThrottle != undefined ? parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2)) : 1;
                                if (risk < 1) {
                                    risk = 1;
                                }
                            }
                        }

                        if (input.maxRiskPerTradeThrottle != undefined) {
                            let maxRiskPerTradeThrottleAmount = parseFloat((input.maxRiskPerTradeThrottle * balance / 100).toFixed(2));
                            if (risk > maxRiskPerTradeThrottleAmount) {
                                risk = maxRiskPerTradeThrottleAmount;
                            }
                        }
                    }
                } else {
                    incrementCounter = 0;
                    let minRiskPerTradeThrottle = input.minRiskPerTradeThrottle != undefined ? parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2)) : 1;
                    risk = input.conservativeType == "gradual" ? parseFloat((lastTrade.risk / 2).toFixed(2)) : minRiskPerTradeThrottle;
                    if (input.minRiskPerTradeThrottle != undefined && risk < minRiskPerTradeThrottle) {
                        risk = minRiskPerTradeThrottle;
                    }
                    if (risk < 1) {
                        risk = 1;
                    }
                }
            }

            // calculate pnl
            if (risk <= balance) {
                profit = win == true ? parseFloat((risk * input.rewardToRiskRatio).toFixed(2)) : -1 * risk;
            } else {
                // blown account
                win = false;
                risk = 0;
                profit = 0;
            }

            // calculate balance
            balance = parseFloat((balance + profit).toFixed(2));

            if (win == true && input.lockInProfitInterval != undefined) {
                isLockInProfit = Math.floor(balance / input.lockInProfitInterval) != Math.floor(lastBalance / input.lockInProfitInterval);
            }

            // profit < interval
            if ((balance - input.startingBalance) < (input.drawdownMitigationProfitInterval * drawdownMitigationProfitIndex)) {
                isAboveDrawdownMitigationProfitInterval = false;
            } else {
                isAboveDrawdownMitigationProfitInterval = true;
                if ((balance - input.startingBalance) >= (input.drawdownMitigationProfitInterval * (drawdownMitigationProfitIndex + 1))) {
                    drawdownMitigationProfitIndex++;
                }
            }

            lastBalance = balance;

            maxBalance = Math.max(maxBalance, balance);

            lastTrade = { win, risk, profit, balance };

            tradesData.push(lastTrade);
        });

        return tradesData;
    }
}

class ConservativeDashboardInputHandler extends DashboardInputHandler {
    constructor(dashboard) {
        super(dashboard);
    }

    generate(input) {
        super.hideDashboard();
        let tradesData = this.computeTradesData(input);
        super.updateData(tradesData);
        super.updateChart(super.generateChartData(input.startingBalance, tradesData));
        super.updateSummary(super.generateChartSummary(input.startingBalance, tradesData));
        super.updateRaw(super.generateRawData(input.startingBalance, tradesData));
        super.showDashboard();
    }

    computeTradesData(input) {
        let tradesResult = input.data;
        if (tradesResult == undefined) {
            tradesResult = super.computeTradesResult(input.numTrades, input.winRate);
        }

        let tradesData = [];
        let balance = input.startingBalance;
        let lastBalance = balance;
        let maxBalance = balance;
        let incrementCounter = 0;
        let isLockInProfit = false;
        let win, risk, profit, lastTrade;

        tradesResult.forEach(result => {
            win = result;

            // calculate the risk
            if (lastTrade) {
                if (lastTrade.win == true) {
                    if (isLockInProfit == true) {
                        incrementCounter = 0;
                        risk = input.minRiskPerTradeThrottle != undefined ? parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2)) : 1;
                        if (risk < 1) {
                            risk = 1;
                        }
                    } else {
                        incrementCounter++;
                        if (incrementCounter >= input.riskIncrementInterval) {
                            incrementCounter = 0;
                            risk = lastTrade.risk * input.riskIncrementMultiplier;
                        }

                        if (input.conservativeType == "minimizedrawdown") {
                            if (balance < maxBalance) {
                                risk = input.minRiskPerTradeThrottle != undefined ? parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2)) : 1;
                                if (risk < 1) {
                                    risk = 1;
                                }
                            }
                        }

                        if (input.maxRiskPerTradeThrottle != undefined) {
                            let maxRiskPerTradeThrottleAmount = parseFloat((input.maxRiskPerTradeThrottle * balance / 100).toFixed(2));
                            if (risk > maxRiskPerTradeThrottleAmount) {
                                risk = maxRiskPerTradeThrottleAmount;
                            }
                        }
                    }
                } else {
                    incrementCounter = 0;
                    let minRiskPerTradeThrottle = input.minRiskPerTradeThrottle != undefined ? parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2)) : 1;
                    risk = input.conservativeType == "gradual" ? parseFloat((lastTrade.risk / 2).toFixed(2)) : minRiskPerTradeThrottle;
                    if (input.minRiskPerTradeThrottle != undefined && risk < minRiskPerTradeThrottle) {
                        risk = minRiskPerTradeThrottle;
                    }
                    if (risk < 1) {
                        risk = 1;
                    }
                }
            } else {
                risk = input.initialRiskPerTrade != undefined ? parseFloat((input.initialRiskPerTrade * balance / 100).toFixed(2)) : 1;
                if (input.maxRiskPerTradeThrottle != undefined) {
                    let maxRiskPerTradeThrottleAmount = parseFloat((input.maxRiskPerTradeThrottle * balance / 100).toFixed(2));
                    if (risk > maxRiskPerTradeThrottleAmount) {
                        risk = maxRiskPerTradeThrottleAmount;
                    }
                }
                if (input.minRiskPerTradeThrottle != undefined) {
                    let minRiskPerTradeThrottleAmount = parseFloat((input.minRiskPerTradeThrottle * balance / 100).toFixed(2));
                    if (risk < minRiskPerTradeThrottleAmount) {
                        risk = minRiskPerTradeThrottleAmount;
                    }
                }
                if (risk < 1) {
                    risk = 1;
                }
            }

            // calculate pnl
            if (risk <= balance) {
                profit = win == true ? parseFloat((risk * input.rewardToRiskRatio).toFixed(2)) : -1 * risk;
            } else {
                // blown account
                win = false;
                risk = 0;
                profit = 0;
            }

            // calculate balance
            balance = parseFloat((balance + profit).toFixed(2));

            if (win == true && input.lockInProfitInterval != undefined) {
                isLockInProfit = Math.floor(balance / input.lockInProfitInterval) != Math.floor(lastBalance / input.lockInProfitInterval);
            }

            lastBalance = balance;

            maxBalance = Math.max(maxBalance, balance);

            lastTrade = { win, risk, profit, balance };

            tradesData.push(lastTrade);
        });

        return tradesData;
    }
}

class RetailDashboardInputHandler extends DashboardInputHandler {
    constructor(dashboard) {
        super(dashboard);
    }

    generate(input) {
        super.hideDashboard();
        let tradesData = this.computeTradesData(input);
        super.updateData(tradesData);
        super.updateChart(super.generateChartData(input.startingBalance, tradesData));
        super.updateSummary(super.generateChartSummary(input.startingBalance, tradesData));
        super.updateRaw(super.generateRawData(input.startingBalance, tradesData));
        super.showDashboard();
    }

    computeTradesData(input) {
        let tradesResult = input.data;
        if (tradesResult == undefined) {
            tradesResult = super.computeTradesResult(input.numTrades, input.winRate);
        }

        let tradesData = [];
        let balance = input.startingBalance;
        let win, risk, profit;

        tradesResult.forEach(result => {
            win = result;

            // calculate the risk
            risk = parseFloat((input.riskPerTrade * balance / 100).toFixed(2));

            if (risk < 1) {
                risk = 1;
            }

            // calculate pnl
            if (risk <= balance) {
                profit = win == true ? parseFloat((risk * input.rewardToRiskRatio).toFixed(2)) : -1 * risk;
            } else {
                // blown account
                win = false;
                risk = 0;
                profit = 0;
            }

            // calculate balance
            balance = parseFloat((balance + profit).toFixed(2));

            tradesData.push({ win, risk, profit, balance });
        });

        return tradesData;
    }
}

class AggressiveDashboardInputHandler extends DashboardInputHandler {
    constructor(dashboard) {
        super(dashboard);
    }

    generate(input) {
        super.hideDashboard();
        let tradesData = this.computeTradesData(input);
        super.updateData(tradesData);
        super.updateChart(super.generateChartData(input.startingBalance, tradesData));
        super.updateSummary(super.generateChartSummary(input.startingBalance, tradesData));
        super.updateRaw(super.generateRawData(input.startingBalance, tradesData));
        super.showDashboard();
    }

    computeTradesData(input) {
        let tradesResult = input.data;
        if (tradesResult == undefined) {
            tradesResult = super.computeTradesResult(input.numTrades, input.winRate);
        }

        let tradesData = [];
        let balance = input.startingBalance;
        let maxBalance = balance;
        let win, risk, profit;

        tradesResult.forEach(result => {
            win = result;

            // calculate the risk
            if (balance < maxBalance) {
                risk = parseFloat((maxBalance - balance).toFixed(2));
            } else {
                risk = parseFloat((input.riskPerTrade * balance / 100).toFixed(2));
            }

            if (risk < 1) {
                risk = 1;
            }

            // calculate pnl
            if (risk <= balance) {
                profit = win == true ? parseFloat((risk * input.rewardToRiskRatio).toFixed(2)) : -1 * risk;
            } else {
                // blown account
                win = false;
                risk = 0;
                profit = 0;
            }

            // calculate balance
            balance = parseFloat((balance + profit).toFixed(2));

            maxBalance = Math.max(balance, maxBalance);

            tradesData.push({ win, risk, profit, balance });
        });

        return tradesData;
    }
}