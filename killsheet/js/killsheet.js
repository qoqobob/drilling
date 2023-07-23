"use strict";

// import {byId, hide, display, setText, deleteChildElementsOf} from "./util.js";
function byId(id) {
    return document.getElementById(id);
}

function setText(id, text) {
    byId(id).innerText = text;
}

function display(id) {
    byId(id).hidden = false;
}

function hide(id) {
    byId(id).hidden = true;
}

function deleteChildElementsOf(element) {
    while (element.lastChild !== null) {
        element.lastChild.remove();
    }
}

function preformatFloat(float) {
    if (!float) {
        return '';
    };

    //Index of first comma
    const posC = float.indexOf(',');

    if (posC === -1) {
        //No commas found, treat as float
        return float;
    };

    //Index of first full stop
    const posFS = float.indexOf('.');

    if (posFS === -1) {
        //Uses commas and not full stops - swap them (e.g. 1,23 --> 1.23)
        return float.replace(/\,/g, '.');
    };

    //Uses both commas and full stops - ensure correct order and remove 1000s separators
    return ((posC < posFS) ? (float.replace(/\,/g, '')) : (float.replace(/\./g, '').replace(',', '.')));
};

//-------------directional survey
function displaySurvey() {
    const survey = sessionStorage.getItem("survey");
    if (survey == null) return;
    if (JSON.parse(survey).length > 0) {
        const tBody = byId("survey");
        deleteChildElementsOf(tBody);
        let i = 0;
        const arrSurvey = JSON.parse(survey);
        arrSurvey.forEach(element => {
            i++;
            const tr = tBody.insertRow();
            tr.insertCell().innerText = i;
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="md${i}" disabled>`;
            byId(`md${i}`).value = element.md;
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="tvd${i}" disabled>`;
            byId(`tvd${i}`).value = element.tvd;
        });

        //if open hole MD or TVD is not filled then last survey point is taken
        if (isNaN(parseFloat(byId("measureDepthHole").value)) || isNaN(parseFloat(byId("tvDepthHole").value))) {
            byId("measureDepthHole").value = arrSurvey[arrSurvey.length - 1].md;
            byId("tvDepthHole").value = arrSurvey[arrSurvey.length - 1].tvd;
        }
    } else {
        displayDefaultSurvey();
        byId("measureDepthHole").value = "";
        byId("tvDepthHole").value = "";
    }
}
displaySurvey();

function displayDefaultSurvey() {
    const tBody = byId("survey");
    tBody.innerHTML = `
    <tr>
    <td>1</td>
    <td><input class="w-100" type="text" id="md1" disabled></td>
    <td><input class="w-100" type="text" id="tvd1" disabled></td>
    </tr>
    <tr>
    <td>2</td>
    <td><input class="w-100" type="text" id="md2" disabled></td>
    <td><input class="w-100" type="text" id="tvd2" disabled></td>
    </tr>`;
}

function displaySurveyInTextarea() {
    const survey = sessionStorage.getItem("survey");
    if (survey == null) return;
    if (JSON.parse(survey).length > 0) {
        byId("textareaSurvey").value = "";
        const arrSurvey = JSON.parse(survey);
        let str = "";
        arrSurvey.forEach(element => {
            str += element.md + "; " + element.tvd + "\n";
        });
        byId("textareaSurvey").value = str;
    } else {
        byId("textareaSurvey").value = "";
    }
}

byId("addSurveyBtn").onclick = () => {
    display("surveyDiv");
    byId("textareaSurvey").focus();
    displaySurveyInTextarea();
}
byId("cancelSurveyBtn").onclick = () => {
    hide("surveyDiv");
    byId("textareaSurvey").value = "";
}
byId("saveSurveyBtn").onclick = () => {
    let survey = [];
    const rawSurvey = byId("textareaSurvey").value;
    const rows = rawSurvey.split(/\r?\n/);
    let isNullValue = false;
    survey.push({
        md: 0,
        tvd: 0
    });
    rows.forEach(element => {
        if (element.trim() != "") {
            const row = element.split(/\t|;/)
            const mdValue = parseFloat(preformatFloat(row[0]));
            const tvdValue = parseFloat(preformatFloat(row[1]));
            survey.push({
                md: mdValue,
                tvd: tvdValue
            });
            if (isNaN(mdValue) || isNaN(tvdValue)) { isNullValue = true; }
        }
    });
    if (!isNullValue) { sessionStorage.setItem("survey", JSON.stringify(survey)); }
    displaySurvey();
    if (parseFloat(byId("measureDepthHole").value) > surveyLastMd()) {
        byId("measureDepthHole").value = surveyLastMd().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(surveyLastMd()).toFixed(2);
    }
    setDpLengthToSurface(parseFloat(byId("measureDepthHole").value)-cumLengthWithoutDp());
    displayDrillstring();
    hide("surveyDiv");
    byId("textareaSurvey").value = "";
}

//-------------drilstring
function displayDefaultDrillstring() {
    const tBody = byId("drillstring");
    tBody.innerHTML = `
    <tr>
    <td>DRILLSTRING COMPONENT 1 <i>(e.g. Bit)</i></td>
    <td><input class="w-100" type="text" id="dsCompLength1" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacity1" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolume1" disabled></td>
    <td><input class="w-100" type="text" id="dsCompStrokes1" disabled></td>
    <td><input class="w-100" type="text" id="dsCompPumpTime1" disabled></td>
    </tr>
    <tr>
    <td>DRILLSTRING COMPONENT 2</td>
    <td><input class="w-100" type="text" id="dsCompLength2" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacity2" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolume2" disabled></td>
    <td><input class="w-100" type="text" id="dsCompStrokes2" disabled></td>
    <td><input class="w-100" type="text" id="dsCompPumpTime2" disabled></td>
    </tr>
    <tr>
    <td>...</td>
    <td><input class="w-100" type="text" id="dsCompLength3" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacity3" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolume3" disabled></td>
    <td><input class="w-100" type="text" id="dsCompStrokes3" disabled></td>
    <td><input class="w-100" type="text" id="dsCompPumpTime3" disabled></td>
    </tr>
    <tr>
    <td>DRILLSTRING COMPONENT N <i>(e.g. DP)</i></td>
    <td><input class="w-100" type="text" id="dsCompLengthN" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacityN" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolumeN" disabled></td>
    <td><input class="w-100" type="text" id="dsCompStrokesN" disabled></td>
    <td><input class="w-100" type="text" id="dsCompPumpTimeN" disabled></td>
    </tr>
    <tr>
    <td colspan="3">DRILLSTRING VOLUME</td>
    <td><input class="w-100" type="text" id="dsVolume" disabled></td>
    <td><input class="w-100" type="text" id="dsStrokes" disabled></td>
    <td><input class="w-100" type="text" id="dsPumpTime" disabled></td>
    </tr>`;
}
function displayDrillstringInTextarea() {
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return;
    if (JSON.parse(drillstring).length > 0) {
        byId("textareaDrillstring").value = "";
        const arrDrillstring = JSON.parse(drillstring);
        let str = "";
        arrDrillstring.forEach(element => {
            str += element.description + "; " + element.length + "; " + element.capacity + "\n";
        });
        byId("textareaDrillstring").value = str;
    } else {
        byId("textareaDrillstring").value = "";
    }
}
function displayDrillstring() {
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return;
    if (JSON.parse(drillstring).length > 0) {
        const tBody = byId("drillstring");
        deleteChildElementsOf(tBody);
        let i = 0;
        const arrDrillstring = JSON.parse(drillstring);
        arrDrillstring.forEach(element => {
            i++;
            const tr = tBody.insertRow();
            tr.insertCell().innerText = element.description;
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="dsCompLength${i}" disabled>`;
            byId(`dsCompLength${i}`).value = Number(element.length).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="dsCompCapacity${i}" disabled>`;
            byId(`dsCompCapacity${i}`).value = Number(element.capacity).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="dsCompVolume${i}" disabled>`;
            byId(`dsCompVolume${i}`).value = Number(element.capacity * element.length).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="dsCompStrokes${i}" disabled>`;
            // byId(`dsCompStrokes${i}`).value = element.capacity*element.length/strokeVolume;
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="dsCompPumpTime${i}" disabled>`;
            // byId(`dsCompPumpTime${i}`).value = element.capacity*element.length/strokeVolume/spm;
        });
    } else {
        displayDefaultDrillstring();
    }
}
displayDrillstring();


byId("addDrillstringBtn").onclick = () => {
    display("drillstringDiv");
    byId("textareaDrillstring").focus();
    displayDrillstringInTextarea();
}
byId("cancelDrillstringBtn").onclick = () => {
    hide("drillstringDiv");
    byId("textareaDrillstring").value = "";
}
byId("saveDrillstringBtn").onclick = () => {
    let drillstring = [];
    const rawDrillstring = byId("textareaDrillstring").value;
    const rows = rawDrillstring.split(/\r?\n/);
    let isNullValue = false;
    rows.forEach(element => {
        if (element.trim() != "") {
            const row = element.split(/\t|;/)
            const descriptionValue = row[0].trim();
            const lengthValue = parseFloat(preformatFloat(row[1]));
            const capacityValue = parseFloat(preformatFloat(row[2]));
            drillstring.push({
                description: descriptionValue,
                length: lengthValue,
                capacity: capacityValue
            });
            if (isNaN(lengthValue) || isNaN(capacityValue)) { isNullValue = true; }
        }
    });
    if (!isNullValue) { sessionStorage.setItem("drillstring", JSON.stringify(drillstring)); }
    displayDrillstring();
    if (parseFloat(byId("measureDepthHole").value) < cumLengthWithoutDp()) {
        console.log(cumLengthWithoutDp());
        byId("measureDepthHole").value = cumLengthWithoutDp().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(cumLengthWithoutDp()).toFixed(2);
    }
    hide("drillstringDiv");
    byId("textareaDrillstring").value = "";
}
//--------------chart data calculation
function getTvdByMd(md) {
    const survey = sessionStorage.getItem("survey");
    if (survey == null) return md;
    const arrSurvey = JSON.parse(survey);
    for (let i = 0; i < arrSurvey.length - 1; i++) {
        if (md == arrSurvey[i].md) {
            return arrSurvey[i].tvd;
        }
        if (md > arrSurvey[i].md && md <= arrSurvey[i + 1].md) {
            return arrSurvey[i].tvd + (md - arrSurvey[i].md) * (arrSurvey[i + 1].tvd - arrSurvey[i].tvd) / (arrSurvey[i + 1].md - arrSurvey[i].md);
        }
    }
    return -1;
}

function getMdByTvd(tvd) {
    const survey = sessionStorage.getItem("survey");
    if (survey == null) return tvd;
    const arrSurvey = JSON.parse(survey);
    for (let i = 0; i < arrSurvey.length - 1; i++) {
        if (tvd == arrSurvey[i].tvd) {
            return arrSurvey[i].md;
        }
        if (tvd > arrSurvey[i].tvd && tvd <= arrSurvey[i + 1].tvd) {
            return arrSurvey[i].md + (tvd - arrSurvey[i].tvd) * (arrSurvey[i + 1].md - arrSurvey[i].md) / (arrSurvey[i + 1].tvd - arrSurvey[i].tvd);
        }
    }
    return -1;
}

function getMdByVolPumped(pumpedVolume) {
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return;
    const arrDrillstring = JSON.parse(drillstring);
    //not finished
}


//auto-fill hole TVD; auto-update drillstring DP length to surface
function cumLengthWithoutDp() {
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return;
    const arrDrillstring = JSON.parse(drillstring);
    let cumLengthWithoutDp = 0;
    for (let i = 0; i < arrDrillstring.length - 1; i++) {
        cumLengthWithoutDp += arrDrillstring[i].length;
    }
    return cumLengthWithoutDp;
}

function surveyLastMd() {
    const survey = sessionStorage.getItem("survey");
    if (survey == null) return;
    const arrSurvey = JSON.parse(survey);
    return arrSurvey[arrSurvey.length - 1].md;
}
function setDpLengthToSurface(value) {
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return;
    const arrDrillstring = JSON.parse(drillstring);
    arrDrillstring[arrDrillstring.length - 1].length=value;
    sessionStorage.setItem("drillstring", JSON.stringify(arrDrillstring)); 
}
byId("measureDepthHole").oninput = () => {
    const mdValue = parseFloat(byId("measureDepthHole").value);
    if (!isNaN(mdValue)) {
        byId("tvDepthHole").value = getTvdByMd(mdValue).toFixed(2);
        byId("measureDepthHole").min = cumLengthWithoutDp();//min depth is cumulative length of the drillstring excluding the length of DP to surface
        byId("measureDepthHole").max = surveyLastMd();//max depth is dir survey total depth
    }
}
byId("measureDepthHole").onchange = () => {
    if (parseFloat(byId("measureDepthHole").value) < cumLengthWithoutDp()) {
        console.log(cumLengthWithoutDp());
        byId("measureDepthHole").value = cumLengthWithoutDp().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(cumLengthWithoutDp()).toFixed(2);
    }
    if (parseFloat(byId("measureDepthHole").value) > surveyLastMd()) {
        byId("measureDepthHole").value = surveyLastMd().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(surveyLastMd()).toFixed(2);
    }
    setDpLengthToSurface(parseFloat(byId("measureDepthHole").value)-cumLengthWithoutDp());
    displayDrillstring();
}

//auto-fill casing shoe tvd
byId("measureDepthShoe").oninput = () => {
    const mdValue = parseFloat(byId("measureDepthShoe").value);
    if (!isNaN(mdValue)) {
        byId("tvDepthShoe").value = getTvdByMd(mdValue).toFixed(2);
    }
}



// -------------chart
let dataXY = [
    [0, 0], [1, -11], [2, 23], [3, 17], [4, 18], [5, 9],
    [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
    [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
    [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
    [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
    [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
    [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
    [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
    [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
    [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
    [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
    [66, 70], [67, 70], [68, 70], [69, 81]
];
google.charts.load('current', { packages: ['corechart', 'line'] });
google.charts.setOnLoadCallback(drawBackgroundColor);

function drawBackgroundColor() {
    var data = new google.visualization.DataTable();
    data.addColumn('number', 'X');
    data.addColumn('number', 'Pressure');


    data.addRows(dataXY);

    var options = {
        hAxis: {
            title: 'STROKES'
        },
        vAxis: {
            title: 'DRILL PIPE PRESSURE, bar'
        },
        backgroundColor: 'white',
        title: 'KILLSHEET CHART'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

window.onresize = () => {
    google.charts.setOnLoadCallback(drawBackgroundColor);
}
