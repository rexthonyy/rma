function getRandom(min, max) {
    return myMap(Math.random(), 0, 1, min, max);
}

function myMap(val, minF, maxF, minT, maxT) {
    return minT + (((val - minF) / (maxF - minF)) * (maxT - minT));
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function percentChange(final, initial) {
    if (initial == 0 && final == 0) return 0;
    if (initial == 0) return 100;
    return Math.floor((final / initial) * 100) - 100;
}