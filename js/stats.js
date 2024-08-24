window.onload = () => {
    loadTakePartials();
    const dashboardContainer = document.getElementById("dashboardContainer");
    const dashboardLoader = document.getElementById("dashboardLoader");
    const dataContainer = document.getElementById("dataContainer");

    reloadData();

    function reloadData() {
        hideDashboard();
        sendGetRequest("/api/fetchStats")
            .then(json => {
                let html = "";

                json.data.forEach(data => {
                    let elm = "";
                    if (data.change) {
                        elm = data.change > 0 ? `<span class="rex-fs-x-small rex-color-green">${data.change}%</span>` : `<span class="rex-fs-x-small rex-color-red">${data.change}%</span>`;
                    }

                    html += `
                    <div class="custom-background-level-2 rex-curDiv-8px rex-border-darkgray rex-pad8px">
                        <p class="rex-fs-small rex-color-darkgray">${data.title}</p>
                        <div class="rex-mt-8px rex-weight-bold">
                            <span class="rex-fs-normal custom-color-white rex-mr-8px">${data.value}</span>
                            ${elm}
                        </div>
                    </div>
                    `;
                });

                this.dataContainer.innerHTML = html;

                showDashboard();
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