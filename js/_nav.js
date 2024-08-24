function loadTakePartials() {
    const customToggleLightSwitch = document.getElementById("customToggleLightSwitch");
    customToggleLightSwitch.addEventListener("change", function() {
        sendPostRequest("/api/changeTakePartialSetting", {
            takePartials: this.checked
        }).then(json => {
            if (json.status == "success") {
                window.location.reload();
            } else {
                customToggleLightSwitch.checked = !this.checked;
            }
        }).catch(err => {
            console.error(err);
            customToggleLightSwitch.checked = !this.checked;
        });
    });
}