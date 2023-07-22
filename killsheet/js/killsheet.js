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
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="md${i}" disabled>`;
            byId(`md${i}`).value = element.md;
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="tvd${i}" disabled>`;
            byId(`tvd${i}`).value = element.tvd;
        });
    } else {
        displayDefaultSurvey();
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
    rows.forEach(element => {
        if (element.trim() != "") {
            const row = element.split(/\t|;/)
            const mdValue = parseFloat(preformatFloat(row[0]));
            const tvdValue = parseFloat(preformatFloat(row[1]));
            survey.push({
                md: mdValue,
                tvd: tvdValue
            });
            if (isNaN(mdValue) || isNaN(tvdValue)) {isNullValue = true;}
        }
    });
    if (!isNullValue) {sessionStorage.setItem("survey", JSON.stringify(survey));}
    displaySurvey();
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
            str += element.description + "; " + element.length + "; " + element.capacity +"\n";
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
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompLength${i}" disabled>`;
            byId(`dsCompLength${i}`).value = Number(element.length).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompCapacity${i}" disabled>`;
            byId(`dsCompCapacity${i}`).value = Number(element.capacity).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompVolume${i}" disabled>`;
            byId(`dsCompVolume${i}`).value = Number(element.capacity*element.length).toFixed(2);
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompStrokes${i}" disabled>`;
            // byId(`dsCompStrokes${i}`).value = element.capacity*element.length/strokeVolume;
            tr.insertCell().innerHTML = `<input class="w-100" type="text" id="dsCompPumpTime${i}" disabled>`;
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
            if (isNaN(lengthValue) || isNaN(capacityValue)) {isNullValue = true;}
        }
    });
    if (!isNullValue) {sessionStorage.setItem("drillstring", JSON.stringify(drillstring));}
    displayDrillstring();
    hide("drillstringDiv");
    byId("textareaDrillstring").value = "";
}
