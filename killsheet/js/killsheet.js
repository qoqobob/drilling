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
byId("addDrillstringBtn").onclick = () => {
    display("drillstringDiv");
    byId("textareaDrillstring").focus();
    // displaySurveyInTextarea();
}
byId("cancelDrillstringBtn").onclick = () => {
    hide("drillstringDiv");
    byId("textareaDrillstring").value = "";
}
