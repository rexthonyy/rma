window.onload = () => {
    loadTakePartials();
    const dashboardContainer = document.getElementById("dashboardContainer");
    const dashboardLoader = document.getElementById("dashboardLoader");
    const dataContainer = document.getElementById("dataContainer");
    const dataTitle = document.getElementById("dataTitle");

    reloadData();

    function reloadData() {
        hideDashboard();
        sendGetRequest("/api/fetchData")
            .then(json => {
                let html = "";

                let numEntries = json.entries.length;
                for (let i = 0; i < numEntries; i++) {
                    let entry = json.entries[i];
                    let background = i % 2 ? "custom-background-level-2" : "";
                    let winLoss = entry.winLoss == "win" ? "rex-color-green" : "rex-color-red";

                    html += `
                        <div class="${background} rex-width-max-content">
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-200px custom-color-white rex-fs-normal rex-border-right-darkgray">${formatDate(new Date(entry.date))}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.pair}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.type}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.entry.toFixed(5)}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.minExit.toFixed(5)}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.finalExit.toFixed(5)}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.maxProfitPrice.toFixed(5)}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.maxLossPrice.toFixed(5)}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">1:${entry.rrMin}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">1:${entry.rrMax}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.durationMin}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.durationMax}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.isReturnToEntry == true}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.isReturnToStop == true}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.hasDisplacement == true}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.tp1 == true}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.tp2 == true}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.tp3 == true}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.bias15m}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.biasDaily}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.biasWeekly}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px ${winLoss} rex-fs-normal rex-border-right-darkgray">${entry.winLoss}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">1:${entry.avgRR}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray">${entry.avgDuration}</div>
                            <div class="rex-pl-8px rex-display-inline-block rex-pb-8px rex-pt-8px rex-width-150px custom-color-white rex-fs-normal rex-border-right-darkgray"><a href="${entry.url}" class="rex-underline-onhover rex-hover rex-color-link" target="_blank">view</a></div>
                    </div>
                    `;

                    dataContainer.innerHTML = html;
                    dataTitle.textContent = `Data (${numEntries})`;
                    showDashboard();
                }
            }).catch(err => {
                console.error(err);
                alert("An error occured. Check the console for more info");
            });
    }

    function showDashboard() {
        dashboardContainer.style.display = "block";
        dashboardLoader.style.display = "none";
    }

    function hideDashboard() {
        dashboardContainer.style.display = "none";
        dashboardLoader.style.display = "block";
    }
};