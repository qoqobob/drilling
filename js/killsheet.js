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



//set to sessionStorage
function displayFromSessionStorage(id) {
    const valueFromSessionStorage = sessionStorage.getItem(id);
    if (valueFromSessionStorage == null) return;
    byId(id).value = valueFromSessionStorage;
}
function setToSessionStorage(id) {
    byId(id).oninput = () => {
        if (isNaN(parseFloat(byId(id).value))) return;
        sessionStorage.setItem(id, (parseFloat(byId(id).value)));
    }
}
setToSessionStorage("sidpp");
displayFromSessionStorage("sidpp");

setToSessionStorage("sicp");
displayFromSessionStorage("sicp");

setToSessionStorage("spm1");
displayFromSessionStorage("spm1");

setToSessionStorage("pump1Srp1");
displayFromSessionStorage("pump1Srp1");

setToSessionStorage("pump1StrokeDisp");
displayFromSessionStorage("pump1StrokeDisp");

setToSessionStorage("currentDensity");
displayFromSessionStorage("currentDensity");

setToSessionStorage("lotPressure");
displayFromSessionStorage("lotPressure");

setToSessionStorage("lotDensity");
displayFromSessionStorage("lotDensity");

displayFromSessionStorage("measureDepthShoe");
displayFromSessionStorage("tvDepthShoe");
displayFromSessionStorage("measureDepthHole");
displayFromSessionStorage("tvDepthHole");



function calcMaxAllowedDensity() {
    // sessionStorage.setItem("lotDensity", parseFloat(byId("lotDensity").value));
    const lotPressure = sessionStorage.getItem("lotPressure");
    if (lotPressure == null) { byId("maxDensity").value = ""; return; }
    const lotDensity = sessionStorage.getItem("lotDensity");
    if (lotDensity == null) { byId("maxDensity").value = ""; return; }
    const tvDepthShoe = sessionStorage.getItem("tvDepthShoe");
    if (tvDepthShoe == null) { byId("maxDensity").value = ""; return; }
    let maxDensity = parseFloat(lotDensity) + parseFloat(lotPressure) / (parseFloat(tvDepthShoe) * 0.0981);
    maxDensity = (Math.floor(maxDensity * 100) / 100); // rounding of 3rd decimal is floor for MAX. ALLOWABLE DRILLING FLUID DENSITY 
    sessionStorage.setItem("maxDensity", maxDensity);
    byId("maxDensity").value = maxDensity;
}
function calcInitialMaasp() {
    const currentDensity = sessionStorage.getItem("currentDensity");
    if (currentDensity == null) { byId("initialMaasp").value = ""; return; }
    const maxDensity = sessionStorage.getItem("maxDensity");
    if (maxDensity == null) { byId("initialMaasp").value = ""; return; }
    const tvDepthShoe = sessionStorage.getItem("tvDepthShoe");
    if (tvDepthShoe == null) { byId("maxDensity").value = ""; return; }
    const initialMaasp = (parseFloat(maxDensity) - parseFloat(currentDensity)) * parseFloat(tvDepthShoe) * 0.0981;
    sessionStorage.setItem("initialMaasp", initialMaasp);
    byId("initialMaasp").value = initialMaasp.toFixed(2);
}
function calcKillDensity() {
    const currentDensity = sessionStorage.getItem("currentDensity");
    if (currentDensity == null) { byId("killMudDensity").value = ""; return; }
    const tvDepthHole = sessionStorage.getItem("tvDepthHole");
    if (tvDepthHole == null) { byId("killMudDensity").value = ""; return; }
    const sidpp = sessionStorage.getItem("sidpp");
    if (sidpp == null) { byId("killMudDensity").value = ""; return; }
    let killMudDensity = parseFloat(currentDensity) + parseFloat(sidpp) / (parseFloat(tvDepthHole) * 0.0981);
    killMudDensity = (Math.ceil(killMudDensity * 10000) / 10000); // kill mud density rounded by ceil to 4 decimals
    sessionStorage.setItem("killMudDensity", killMudDensity);
    byId("killMudDensity").value = killMudDensity;

}
function calcInitialCircPressure() {
    const pump1Srp1 = sessionStorage.getItem("pump1Srp1");
    if (pump1Srp1 == null) { byId("icp").value = ""; return; }
    const sidpp = sessionStorage.getItem("sidpp");
    if (sidpp == null) { byId("icp").value = ""; return; }
    const icp = parseFloat(pump1Srp1) + parseFloat(sidpp);
    sessionStorage.setItem("icp", icp);
    byId("icp").value = icp.toFixed(1);
}
function calcFinalCircPressure() {
    const pump1Srp1 = sessionStorage.getItem("pump1Srp1");
    if (pump1Srp1 == null) { byId("fcp").value = ""; return; }
    const killMudDensity = sessionStorage.getItem("killMudDensity");
    if (killMudDensity == null) { byId("fcp").value = ""; return; }
    const currentDensity = sessionStorage.getItem("currentDensity");
    if (currentDensity == null) { byId("fcp").value = ""; return; }
    const fcp = parseFloat(pump1Srp1) * parseFloat(killMudDensity) / parseFloat(currentDensity);
    sessionStorage.setItem("fcp", fcp);
    byId("fcp").value = fcp.toFixed(2);
}

byId("lotPressure").onchange = () => {
    //calculate MAX. ALLOWABLE DRILLING FLUID DENSITY
    calcMaxAllowedDensity();

    //calculate INITIAL MAASP
    calcInitialMaasp();
}
byId("lotDensity").onchange = () => {
    //calculate MAX. ALLOWABLE DRILLING FLUID DENSITY
    calcMaxAllowedDensity();

    //calculate INITIAL MAASP
    calcInitialMaasp();
}

byId("measureDepthShoe").onchange = () => {
    //calculate MAX. ALLOWABLE DRILLING FLUID DENSITY
    calcMaxAllowedDensity();

    //calculate INITIAL MAASP
    calcInitialMaasp();
}
byId("currentDensity").onchange = () => {
    //calculate INITIAL MAASP
    calcInitialMaasp();

    //calculate kill mud density
    calcKillDensity();

    // calculate fcp
    calcFinalCircPressure();

    //redraw chart
    dataXY = calcKillChartData();
    google.charts.setOnLoadCallback(drawBackgroundColor);
    displayChartTable();
}

byId("sidpp").onchange = () => {
    //calculate kill mud density
    calcKillDensity();

    //calculate icp
    calcInitialCircPressure();

    // calculate fcp
    calcFinalCircPressure();

    //redraw chart
    dataXY = calcKillChartData();
    google.charts.setOnLoadCallback(drawBackgroundColor);
    displayChartTable();
}
byId("pump1Srp1").onchange = () => {
    //calculate icp
    calcInitialCircPressure();

    // calculate fcp
    calcFinalCircPressure();

    //redraw chart
    dataXY = calcKillChartData();
    google.charts.setOnLoadCallback(drawBackgroundColor);
    displayChartTable();
}

// byId("measureDepthHole").onchange = () => { see below this event handler
//     //calculate kill mud density
//     calcKillDensity();
// }


//calculate MAX. ALLOWABLE DRILLING FLUID DENSITY
calcMaxAllowedDensity();

//calculate INITIAL MAASP
calcInitialMaasp();

//calculate kill maud density
calcKillDensity();

//calculate icp
calcInitialCircPressure();

// calculate fcp
calcFinalCircPressure();


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
        if (isNaN(parseFloat(byId("measureDepthHole").value)) || isNaN(parseFloat(byId("tvDepthHole").value))
        ) {
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
    if (rawSurvey.trim() == "") {
        hide("surveyDiv");
        byId("textareaSurvey").value = "";
        return;
    }
    const rows = rawSurvey.split(/\r?\n/);
    let isNullValue = false;

    let i = 0;
    while (rows[i].trim() == "") {
        i++;
    }
    const row = rows[i].split(/\t|;/)
    if (parseFloat(preformatFloat(row[0])) != 0) {
        survey.push({
            md: 0,
            tvd: 0
        });
    };

    rows.forEach(element => {
        if (element.trim() != "") {
            const row = element.split(/\t|;/)
            const mdValue = parseFloat(preformatFloat(row[0]));
            const tvdValue = parseFloat(preformatFloat(row[1]));
            if (survey.map(element => element.md).includes(mdValue) == false) {
                survey.push({
                    md: mdValue,
                    tvd: tvdValue
                });
                if (isNaN(mdValue) || isNaN(tvdValue)) { isNullValue = true; }
            }

        }
    });
    if (!isNullValue) { sessionStorage.setItem("survey", JSON.stringify(survey)); }
    displaySurvey();
    if (parseFloat(byId("measureDepthHole").value) > surveyLastMd()) {
        byId("measureDepthHole").value = surveyLastMd().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(surveyLastMd()).toFixed(2);
    }
    if(cumLengthWithoutDp() < parseFloat(byId("measureDepthHole").value)) {
        setDpLengthToSurface(parseFloat(byId("measureDepthHole").value) - cumLengthWithoutDp());
    } else{
        setDpLengthToSurface(0);
        byId("measureDepthHole").value = cumLengthWithoutDp().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(cumLengthWithoutDp()).toFixed(2);
    }

    sessionStorage.setItem("measureDepthHole", JSON.stringify(parseFloat(byId("measureDepthHole").value)));
    sessionStorage.setItem("tvDepthHole", JSON.stringify(parseFloat(byId("tvDepthHole").value)));
    setDpLengthToSurface(parseFloat(byId("measureDepthHole").value) - cumLengthWithoutDp());
    displayDrillstring();
    setVolumeDepthArray();

    //calculate kill mud density
    calcKillDensity();

    // calculate fcp
    calcFinalCircPressure();

    hide("surveyDiv");
    byId("textareaSurvey").value = "";

    //redraw chart
    dataXY = calcKillChartData();
    google.charts.setOnLoadCallback(drawBackgroundColor);
    displayChartTable();
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

    </tr>
    <tr>
    <td>DRILLSTRING COMPONENT 2</td>
    <td><input class="w-100" type="text" id="dsCompLength2" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacity2" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolume2" disabled></td>

    </tr>
    <tr>
    <td>...</td>
    <td><input class="w-100" type="text" id="dsCompLength3" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacity3" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolume3" disabled></td>

    </tr>
    <tr>
    <td>DRILLSTRING COMPONENT N <i>(e.g. DP)</i></td>
    <td><input class="w-100" type="text" id="dsCompLengthN" disabled></td>
    <td><input class="w-100" type="text" id="dsCompCapacityN" disabled></td>
    <td><input class="w-100" type="text" id="dsCompVolumeN" disabled></td>

    </tr>
    <tr>
    <td colspan="3">DRILLSTRING VOLUME</td>
    <td><input class="w-100" type="text" id="dsVolume" disabled></td>

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
        let cumVol =0;
        arrDrillstring.forEach(element => {
            i++;
            const tr = tBody.insertRow();
            tr.insertCell().innerText = element.description;
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompLength${i}" disabled>`;
            byId(`dsCompLength${i}`).value = Number(element.length).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompCapacity${i}" disabled>`;
            byId(`dsCompCapacity${i}`).value = Number(element.capacity).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompVolume${i}" disabled>`;
            byId(`dsCompVolume${i}`).value = Number(element.capacity * element.length).toFixed(2);
            // tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompStrokes${i}" disabled>`;
            // byId(`dsCompStrokes${i}`).value = element.capacity*element.length/strokeVolume;
            // tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompPumpTime${i}" disabled>`;
            // byId(`dsCompPumpTime${i}`).value = element.capacity*element.length/strokeVolume/spm;
            cumVol+=element.capacity * element.length;
        });
        const trSum = tBody.insertRow();
        trSum.innerHTML = `<td colspan="3">DRILLSTRING VOLUME</td>
        <td><input class="w-100" type="text" id="dsVolume" disabled></td>
        `;
        byId("dsVolume").value = cumVol.toFixed(2);
        
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
        byId("measureDepthHole").value = cumLengthWithoutDp().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(cumLengthWithoutDp()).toFixed(2);
    }
    setVolumeDepthArray();
    hide("drillstringDiv");
    byId("textareaDrillstring").value = "";

    //redraw chart
    dataXY = calcKillChartData();
    google.charts.setOnLoadCallback(drawBackgroundColor);
    displayChartTable();
}

//auto-fill hole TVD; auto-update drillstring DP length to surface
function cumLengthWithoutDp() {
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return 0;
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
    arrDrillstring[arrDrillstring.length - 1].length = value;
    sessionStorage.setItem("drillstring", JSON.stringify(arrDrillstring));
}

byId("measureDepthHole").oninput = () => {
    const mdValue = parseFloat(byId("measureDepthHole").value);
    if (!isNaN(mdValue)) {
        byId("tvDepthHole").value = getTvdByMd(mdValue).toFixed(2);
        byId("measureDepthHole").min = cumLengthWithoutDp();//min depth is cumulative length of the drillstring excluding the length of DP to surface
        // byId("measureDepthHole").max = surveyLastMd();//max depth is dir survey total depth
        sessionStorage.setItem("measureDepthHole", JSON.stringify(parseFloat(byId("measureDepthHole").value)));
        sessionStorage.setItem("tvDepthHole", JSON.stringify(parseFloat(byId("tvDepthHole").value)));

    }
}
byId("measureDepthHole").onchange = () => {
    if (parseFloat(byId("measureDepthHole").value) < cumLengthWithoutDp()) {
        byId("measureDepthHole").value = cumLengthWithoutDp().toFixed(2);
        byId("tvDepthHole").value = getTvdByMd(cumLengthWithoutDp()).toFixed(2);
    }
    // if (parseFloat(byId("measureDepthHole").value) > surveyLastMd()) {
    //     byId("measureDepthHole").value = surveyLastMd().toFixed(2);
    //     byId("tvDepthHole").value = getTvdByMd(surveyLastMd()).toFixed(2);
    // }
    sessionStorage.setItem("measureDepthHole", JSON.stringify(parseFloat(byId("measureDepthHole").value)));
    sessionStorage.setItem("tvDepthHole", JSON.stringify(parseFloat(byId("tvDepthHole").value)));
    setDpLengthToSurface(parseFloat(byId("measureDepthHole").value) - cumLengthWithoutDp());
    displayDrillstring();
    setVolumeDepthArray();

    //calculate kill mud density
    calcKillDensity();

    // calculate fcp
    calcFinalCircPressure();

    //redraw chart
    dataXY = calcKillChartData();
    google.charts.setOnLoadCallback(drawBackgroundColor);
    displayChartTable();
}

//auto-fill casing shoe tvd
byId("measureDepthShoe").oninput = () => {
    const mdValue = parseFloat(byId("measureDepthShoe").value);

    if (!isNaN(mdValue)) {
        byId("tvDepthShoe").value = getTvdByMd(mdValue).toFixed(2);
        sessionStorage.setItem("measureDepthShoe", JSON.stringify(parseFloat(byId("measureDepthShoe").value)));
        sessionStorage.setItem("tvDepthShoe", JSON.stringify(parseFloat(byId("tvDepthShoe").value)));
    }
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
    if (md > arrSurvey[arrSurvey.length - 1].md && arrSurvey.length > 1) {
        return arrSurvey[arrSurvey.length - 1].tvd + (md - arrSurvey[arrSurvey.length - 1].md) * (arrSurvey[arrSurvey.length - 1].tvd - arrSurvey[arrSurvey.length - 2].tvd) / (arrSurvey[arrSurvey.length - 1].md - arrSurvey[arrSurvey.length - 2].md);
    }
    return md;
}

// function getMdByTvd(tvd) {
//     const survey = sessionStorage.getItem("survey");
//     if (survey == null) return tvd;
//     const arrSurvey = JSON.parse(survey);
//     for (let i = 0; i < arrSurvey.length - 1; i++) {
//         if (tvd == arrSurvey[i].tvd) {
//             return arrSurvey[i].md;
//         }
//         if (tvd > arrSurvey[i].tvd && tvd <= arrSurvey[i + 1].tvd) {
//             return arrSurvey[i].md + (tvd - arrSurvey[i].tvd) * (arrSurvey[i + 1].md - arrSurvey[i].md) / (arrSurvey[i + 1].tvd - arrSurvey[i].tvd);
//         }
//     }
//     return -1;
// }
function setVolumeDepthArray() {
    const volumeDepth = [];
    const drillstring = sessionStorage.getItem("drillstring");
    if (drillstring == null) return;
    const arrDrillstring = JSON.parse(drillstring);
    volumeDepth.push({
        cumVolume: 0,
        md: 0
    });

    for (let i = arrDrillstring.length - 1; i >= 0; i--) {
        volumeDepth.push({
            cumVolume: volumeDepth[volumeDepth.length - 1].cumVolume + arrDrillstring[i].length * arrDrillstring[i].capacity,
            md: volumeDepth[volumeDepth.length - 1].md + arrDrillstring[i].length
        });
    };

    sessionStorage.setItem("volumeDepth", JSON.stringify(volumeDepth));
}

function getMdByVolPumped(pumpedVolume) {
    const volumeDepth = sessionStorage.getItem("volumeDepth");
    if (volumeDepth == null) return;
    const arrVolumeDepth = JSON.parse(volumeDepth);
    for (let i = 0; i < arrVolumeDepth.length - 1; i++) {
        if (pumpedVolume == arrVolumeDepth[i].cumVolume) {
            return arrVolumeDepth[i].md;
        }
        if (pumpedVolume > arrVolumeDepth[i].cumVolume && pumpedVolume <= arrVolumeDepth[i + 1].cumVolume) {
            return arrVolumeDepth[i].md + (pumpedVolume - arrVolumeDepth[i].cumVolume) * (arrVolumeDepth[i + 1].md - arrVolumeDepth[i].md) / (arrVolumeDepth[i + 1].cumVolume - arrVolumeDepth[i].cumVolume);
        }
    }
    if (pumpedVolume > arrVolumeDepth[arrVolumeDepth.length - 1].cumVolume) {
        return arrVolumeDepth[arrVolumeDepth.length - 1].md;
    }
}
function calcKillChartData() {
    const killChartData = [];
    const interval = 10; //strokes
    const pump1StrokeDisp = sessionStorage.getItem("pump1StrokeDisp");
    if (pump1StrokeDisp == null) { return; }

    const pump1Srp1 = sessionStorage.getItem("pump1Srp1");
    if (pump1Srp1 == null) { return; }

    const killMudDensity = sessionStorage.getItem("killMudDensity");
    if (killMudDensity == null) { return; }

    const currentDensity = sessionStorage.getItem("currentDensity");
    if (currentDensity == null) { return; }

    const sidpp = sessionStorage.getItem("sidpp");
    if (sidpp == null) { return; }

    const volumeDepth = sessionStorage.getItem("volumeDepth");
    if (volumeDepth == null) { return; }
    const arrVolumeDepth = JSON.parse(volumeDepth);
    let volumePumped = 0;
    let strokesPumped = 0;
    let spp = 0;
    while (volumePumped < arrVolumeDepth[arrVolumeDepth.length - 1].cumVolume) {

        spp = parseFloat(pump1Srp1) + (parseFloat(pump1Srp1) * parseFloat(killMudDensity) / parseFloat(currentDensity) - parseFloat(pump1Srp1)) * volumePumped / arrVolumeDepth[arrVolumeDepth.length - 1].cumVolume + parseFloat(sidpp) - getTvdByMd(getMdByVolPumped(volumePumped)) * (parseFloat(killMudDensity) - parseFloat(currentDensity)) * 0.0981;

        killChartData.push([strokesPumped, spp]);

        strokesPumped += interval;
        volumePumped = strokesPumped * parseFloat(pump1StrokeDisp);
    }
    volumePumped = arrVolumeDepth[arrVolumeDepth.length - 1].cumVolume;
    spp = parseFloat(pump1Srp1) + (parseFloat(pump1Srp1) * parseFloat(killMudDensity) / parseFloat(currentDensity) - parseFloat(pump1Srp1)) * volumePumped / arrVolumeDepth[arrVolumeDepth.length - 1].cumVolume + parseFloat(sidpp) - getTvdByMd(getMdByVolPumped(volumePumped)) * (parseFloat(killMudDensity) - parseFloat(currentDensity)) * 0.0981;
    killChartData.push([volumePumped / parseFloat(pump1StrokeDisp), spp]);
    return killChartData;
}
// -------------chart
let dataXY;
dataXY = calcKillChartData();

// console.log(dataXY);
//     [0, 0], [1, -11], [2, 23], [3, 17], [4, 18], [5, 9],
//     [6, 11], [7, 27], [8, 33], [9, 40], [10, 32], [11, 35],
//     [12, 30], [13, 40], [14, 42], [15, 47], [16, 44], [17, 48],
//     [18, 52], [19, 54], [20, 42], [21, 55], [22, 56], [23, 57],
//     [24, 60], [25, 50], [26, 52], [27, 51], [28, 49], [29, 53],
//     [30, 55], [31, 60], [32, 61], [33, 59], [34, 62], [35, 65],
//     [36, 62], [37, 58], [38, 55], [39, 61], [40, 64], [41, 65],
//     [42, 63], [43, 66], [44, 67], [45, 69], [46, 69], [47, 70],
//     [48, 72], [49, 68], [50, 66], [51, 65], [52, 67], [53, 70],
//     [54, 71], [55, 72], [56, 73], [57, 75], [58, 70], [59, 68],
//     [60, 64], [61, 60], [62, 65], [63, 67], [64, 68], [65, 69],
//     [66, 70], [67, 70], [68, 70], [69, 81]
// ];
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
        title: 'KILLSHEET CHART - Pumping stage from surface to the bit'
    };

    var chart = new google.visualization.LineChart(document.getElementById('chart_div'));
    chart.draw(data, options);
}

window.onresize = () => {
    google.charts.setOnLoadCallback(drawBackgroundColor);
}

function displayChartTable() {
    if (Array.isArray(dataXY) && dataXY.length > 0) {
        const tBody = byId("chartData");
        deleteChildElementsOf(tBody);
        let i = 0;
        dataXY.forEach(element => {
            i++;
            const tr = tBody.insertRow();
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="strokes${i}" disabled>`;
            byId(`strokes${i}`).value = element[0].toFixed(0);
            tr.insertCell().innerHTML = `<input class="w-100" type="number" id="spp${i}" disabled>`;
            byId(`spp${i}`).value = element[1].toFixed(2);
        });

    } else {
        dataXY=[[0,0]];
        displayDefaultChartTable();
    }
}
displayChartTable();

function displayDefaultChartTable() {
    const tBody = byId("chartData");
    tBody.innerHTML = `
    <tr>
    <td><input class="w-100" type="text" id="strokes1" disabled></td>
    <td><input class="w-100" type="text" id="spp1" disabled></td>
    </tr>
    <tr>
    <td><input class="w-100" type="text" id="strokes2" disabled></td>
    <td><input class="w-100" type="text" id="spp2" disabled></td>
    </tr>`;
}

//clear all data and forms
byId("clearSessionButton").onclick = () => {
    sessionStorage.clear();
}

//default example
function setDefaultData(){
    let value =
        [{"md":0,"tvd":0},{"md":124,"tvd":124},{"md":130,"tvd":129.99},{"md":140,"tvd":139.99},{"md":150,"tvd":149.97},{"md":160,"tvd":159.95},{"md":170,"tvd":169.93},{"md":180,"tvd":179.91},{"md":190,"tvd":189.89},{"md":200,"tvd":199.86},{"md":210,"tvd":209.81},{"md":220,"tvd":219.76},{"md":230,"tvd":229.69},{"md":240,"tvd":239.61},{"md":250,"tvd":249.53},{"md":260,"tvd":259.43},{"md":270,"tvd":269.31},{"md":280,"tvd":279.17},{"md":290,"tvd":289.02},{"md":300,"tvd":298.85},{"md":310,"tvd":308.67},{"md":320,"tvd":318.47},{"md":330,"tvd":328.26},{"md":340,"tvd":338.04},{"md":350,"tvd":347.82},{"md":360,"tvd":357.58},{"md":370,"tvd":367.33},{"md":380,"tvd":377.06},{"md":390,"tvd":386.76},{"md":400,"tvd":396.45},{"md":410,"tvd":406.1},{"md":420,"tvd":415.72},{"md":430,"tvd":425.3},{"md":440,"tvd":434.84},{"md":450,"tvd":444.34},{"md":460,"tvd":453.82},{"md":470,"tvd":463.26},{"md":480,"tvd":472.68},{"md":490,"tvd":482.08},{"md":500,"tvd":491.47},{"md":510,"tvd":500.84},{"md":520,"tvd":510.2},{"md":530,"tvd":519.54},{"md":540,"tvd":528.84},{"md":550,"tvd":538.08},{"md":558.5,"tvd":545.88},{"md":565.43,"tvd":552.23},{"md":566,"tvd":552.75},{"md":594.17,"tvd":578.55},{"md":622.67,"tvd":604.77},{"md":651.44,"tvd":631.38},{"md":680.24,"tvd":658.08},{"md":708.95,"tvd":684.74},{"md":737.81,"tvd":711.59},{"md":766.53,"tvd":738.31},{"md":795.27,"tvd":765.03},{"md":823.99,"tvd":791.68},{"md":852.79,"tvd":818.38},{"md":881.55,"tvd":845.05},{"md":910.27,"tvd":871.74},{"md":939.03,"tvd":898.5},{"md":967.8,"tvd":925.29},{"md":996.52,"tvd":952.02},{"md":1025.36,"tvd":978.84},{"md":1054.02,"tvd":1005.49},{"md":1082.72,"tvd":1032.18},{"md":1099.29,"tvd":1047.6},{"md":1107,"tvd":1054.78},{"md":1107.72,"tvd":1055.45},{"md":1136.5,"tvd":1082.2},{"md":1165.24,"tvd":1108.94},{"md":1193.96,"tvd":1135.68},{"md":1222.5,"tvd":1162.25},{"md":1251.38,"tvd":1189.19},{"md":1280.17,"tvd":1216.09},{"md":1308.91,"tvd":1242.95},{"md":1337.63,"tvd":1269.79},{"md":1366.57,"tvd":1296.84},{"md":1395.11,"tvd":1323.52},{"md":1423.66,"tvd":1350.21},{"md":1452.27,"tvd":1376.95},{"md":1480.91,"tvd":1403.7},{"md":1509.67,"tvd":1430.52},{"md":1538.28,"tvd":1457.17},{"md":1566.57,"tvd":1483.53},{"md":1595.23,"tvd":1510.24},{"md":1602.27,"tvd":1516.8},{"md":1610,"tvd":1524},{"md":1623.46,"tvd":1536.56},{"md":1652.27,"tvd":1563.45},{"md":1660,"tvd":1570.66},{"md":1670,"tvd":1579.99},{"md":1680,"tvd":1589.31},{"md":1683.71,"tvd":1592.77},{"md":1690,"tvd":1598.64},{"md":1700,"tvd":1607.96},{"md":1710,"tvd":1617.28},{"md":1720,"tvd":1626.6},{"md":1730,"tvd":1635.92},{"md":1740,"tvd":1645.24},{"md":1750,"tvd":1654.57},{"md":1760,"tvd":1663.89},{"md":1770,"tvd":1673.21},{"md":1780,"tvd":1682.53},{"md":1790,"tvd":1691.85},{"md":1800,"tvd":1701.17},{"md":1810,"tvd":1710.5},{"md":1820,"tvd":1719.82},{"md":1830,"tvd":1729.14},{"md":1840,"tvd":1738.46},{"md":1850,"tvd":1747.78},{"md":1860,"tvd":1757.1},{"md":1870,"tvd":1766.43},{"md":1872.33,"tvd":1768.6},{"md":1880,"tvd":1775.74},{"md":1890,"tvd":1785.04},{"md":1900,"tvd":1794.31},{"md":1910,"tvd":1803.56},{"md":1920,"tvd":1812.79},{"md":1930,"tvd":1822},{"md":1940,"tvd":1831.18},{"md":1950,"tvd":1840.35},{"md":1960,"tvd":1849.49},{"md":1970,"tvd":1858.6},{"md":1980,"tvd":1867.69},{"md":1986.54,"tvd":1873.62},{"md":1990,"tvd":1876.76},{"md":2000,"tvd":1885.82},{"md":2010,"tvd":1894.89},{"md":2020,"tvd":1903.95},{"md":2030,"tvd":1913.01},{"md":2040,"tvd":1922.07},{"md":2045,"tvd":1926.61},{"md":2046.54,"tvd":1928},{"md":2050,"tvd":1931.14},{"md":2060,"tvd":1940.2},{"md":2070,"tvd":1949.26},{"md":2080,"tvd":1958.33},{"md":2090,"tvd":1967.39},{"md":2100,"tvd":1976.45},{"md":2110,"tvd":1985.52},{"md":2120,"tvd":1994.58},{"md":2121.54,"tvd":1995.97},{"md":2130,"tvd":2003.61},{"md":2140,"tvd":2012.57},{"md":2150,"tvd":2021.44},{"md":2160,"tvd":2030.23},{"md":2170,"tvd":2038.92},{"md":2180,"tvd":2047.53},{"md":2190,"tvd":2056.04},{"md":2200,"tvd":2064.45},{"md":2210,"tvd":2072.76},{"md":2220,"tvd":2080.97},{"md":2230,"tvd":2089.07},{"md":2240,"tvd":2097.06},{"md":2250,"tvd":2104.94},{"md":2260,"tvd":2112.7},{"md":2270,"tvd":2120.35},{"md":2280,"tvd":2127.88},{"md":2290,"tvd":2135.28},{"md":2300,"tvd":2142.56},{"md":2310,"tvd":2149.72},{"md":2320,"tvd":2156.74},{"md":2330,"tvd":2163.63},{"md":2340,"tvd":2170.39},{"md":2350,"tvd":2177.01},{"md":2360,"tvd":2183.49},{"md":2370,"tvd":2189.83},{"md":2380,"tvd":2196.03},{"md":2390,"tvd":2202.08},{"md":2400,"tvd":2207.99},{"md":2410,"tvd":2213.74},{"md":2420,"tvd":2219.35},{"md":2430,"tvd":2224.8},{"md":2440,"tvd":2230.1},{"md":2450,"tvd":2235.23},{"md":2460,"tvd":2240.22},{"md":2470,"tvd":2245.04},{"md":2480,"tvd":2249.69},{"md":2490,"tvd":2254.19},{"md":2500,"tvd":2258.52},{"md":2510,"tvd":2262.68},{"md":2520,"tvd":2266.68},{"md":2530,"tvd":2270.5},{"md":2540,"tvd":2274.16},{"md":2550,"tvd":2277.64},{"md":2560,"tvd":2280.95},{"md":2570,"tvd":2284.09},{"md":2580,"tvd":2287.05},{"md":2590,"tvd":2289.84},{"md":2600,"tvd":2292.45},{"md":2610,"tvd":2294.88},{"md":2620,"tvd":2297.13},{"md":2630,"tvd":2299.2},{"md":2640,"tvd":2301.1},{"md":2650,"tvd":2302.81},{"md":2660,"tvd":2304.34},{"md":2670,"tvd":2305.69},{"md":2680,"tvd":2306.85},{"md":2690,"tvd":2307.83},{"md":2700,"tvd":2308.63},{"md":2705.56,"tvd":2309},{"md":2710,"tvd":2309.25},{"md":2720,"tvd":2309.68},{"md":2730,"tvd":2309.93},{"md":2738.55,"tvd":2310},{"md":2740,"tvd":2310},{"md":3300,"tvd":2310}]
    ;
    sessionStorage.setItem("survey",JSON.stringify(value));

    sessionStorage.setItem("currentDensity", "1.2");
    sessionStorage.setItem("measureDepthHole", "3300");
    sessionStorage.setItem("fcp", "21.74");
    sessionStorage.setItem("pump1Srp1", "20.69");
    sessionStorage.setItem("pump1StrokeDisp", "19.1");
    sessionStorage.setItem("sidpp", "13.79");
    sessionStorage.setItem("icp", "34.48");

    value = [{"description":"6 1/8\"  MDI 613 LWEBPX","length":0.24,"capacity":0.791730436},{"description":"PD 475 X6 AA 6\" Slick CC (Float valve ported)","length":4.06,"capacity":6.713671415},{"description":"Saver Sub X-over","length":0.39,"capacity":1.551791655},{"description":"E-Mag Receiver with 6\" Stabilizer","length":1.5,"capacity":2.565206613},{"description":"E-Mag Crossover","length":0.72,"capacity":1.551791655},{"description":"IMPulse","length":9.85,"capacity":2.565206613},{"description":"ILS","length":0.45,"capacity":3.166921744},{"description":"VPWD","length":4.58,"capacity":2.565206613},{"description":"ADN-4 with 5 7/8\" Stabilizer","length":7.07,"capacity":2.565206613},{"description":"ADN upper NM Pony Sub","length":0.46,"capacity":3.166921744},{"description":"5\" By-Pass Ball Catcher Sub","length":1.8,"capacity":0.889588318},{"description":"5\" Well Commander","length":1.8,"capacity":1.371163106},{"description":"5 7/8\" NM String Stabilizer","length":1.73,"capacity":2.565206613},{"description":"1 x 4 3/4\" CSNMDC","length":9.48,"capacity":2.565206613},{"description":"Crossover","length":0.81,"capacity":2.565206613},{"description":"3 x 4\" HWDP","length":29.3,"capacity":3.327247158},{"description":"4 3/4\" Hydraulic Jar w/XT39 connections","length":9.21,"capacity":2.565206613},{"description":"5 x 4\" HWDP","length":48.81,"capacity":3.327247158},{"description":"4 3/4\" Accelerator w/XT39 connections","length":9.57,"capacity":2.565206613},{"description":"2 x 4\" HWDP","length":19.52,"capacity":3.327247158},{"description":"4\" Drill Pipes","length":2233.41,"capacity":5.652625954},{"description":"Crossover","length":0.81,"capacity":2.565206613},{"description":"5-7/8 \" Drill Pipe to surface","length":904.4300000000003,"capacity":13.45481094}];
    sessionStorage.setItem("drillstring", JSON.stringify(value));

    sessionStorage.setItem("killMudDensity", "1.2609");

    value = [{"cumVolume":0,"md":0},{"cumVolume":12168.934658464204,"md":904.4300000000003},{"cumVolume":12171.012475820735,"md":905.2400000000002},{"cumVolume":24795.643807743872,"md":3138.65},{"cumVolume":24860.591672268034,"md":3158.17},{"cumVolume":24885.140699554446,"md":3167.7400000000002},{"cumVolume":25047.543633336427,"md":3216.55},{"cumVolume":25071.169186242158,"md":3225.76},{"cumVolume":25168.657527971558,"md":3255.0600000000004},{"cumVolume":25170.73534532809,"md":3255.8700000000003},{"cumVolume":25195.053504019328,"md":3265.3500000000004},{"cumVolume":25199.491311459817,"md":3267.0800000000004},{"cumVolume":25201.959405050617,"md":3268.8800000000006},{"cumVolume":25203.560664023018,"md":3270.6800000000007},{"cumVolume":25205.017448025257,"md":3271.140000000001},{"cumVolume":25223.15345877917,"md":3278.210000000001},{"cumVolume":25234.902105066707,"md":3282.790000000001},{"cumVolume":25236.327219851508,"md":3283.2400000000007},{"cumVolume":25261.594504989556,"md":3293.0900000000006},{"cumVolume":25262.711794981155,"md":3293.8100000000004},{"cumVolume":25266.559604900656,"md":3295.3100000000004},{"cumVolume":25267.164803646105,"md":3295.7000000000003},{"cumVolume":25294.422309591006,"md":3299.76},{"cumVolume":25294.612324895646,"md":3300}];
    sessionStorage.setItem("volumeDepth", JSON.stringify(value));
    sessionStorage.setItem("tvDepthHole", "2310");
}

byId("defaultChartButton").onclick = () => {
    setDefaultData();
    location.reload();
}
