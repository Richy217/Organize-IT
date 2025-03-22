import { editTableCell } from './tableFunctions';
import { NOTIZ, BEARBEITET } from '../files/specialColumns';

export function getBearbeitetKey(notizKey) {
    return BEARBEITET + notizKey.replace(NOTIZ, "");
};

export function getNotizKey(bearbeitetKey) {
    return NOTIZ + bearbeitetKey.replace(BEARBEITET, "");
};

export function isNotEmpty(row, key) {
    return row[key] !== undefined && row[key] !== "";
};

export function hasNotes(row) {
    let notes = Object.keys(row).filter(key => key.startsWith(NOTIZ));
    notes = notes.filter(key => isNotEmpty(row, key));
    return notes.length > 0;
};

export function noteCount(row) {
    return Object.keys(row).filter(key => key.startsWith(NOTIZ) && row[key] !== "").length;
};

export function notesChecked(row) {
    return Object.keys(row).filter(key => key.startsWith(BEARBEITET) && row[key] !== "").length;
};

export function allNotesChecked(row) {
    return noteCount(row) === notesChecked(row);
};

export function notesCheckedPercentage(row) {
    let notes = noteCount(row);
    if (notes === 0) return -1; // -1 means no notes, so not to divide by 0
    return Math.round((notesChecked(row) / notes )* 100);  
};

export function addNote(dispatch, fileIndex, rowIndex, row) {
    let i = noteCount(row) + 1;
    editTableCell(dispatch, fileIndex, rowIndex, `${NOTIZ}${i}`, " ");
    editTableCell(dispatch, fileIndex, rowIndex, `${BEARBEITET}${i}`, "");
};

export function deleteNote(dispatch, fileIndex, rowIndex, row, notizKey) {
    let i = parseInt(notizKey.split("-")[1]);
    while (isNotEmpty(row, `Notiz-${i + 1}`)) {
        editTableCell(dispatch, fileIndex, rowIndex, `${NOTIZ}${i}`, row[`${NOTIZ}${i + 1}`]);
        editTableCell(dispatch, fileIndex, rowIndex, `${BEARBEITET}${i}`, row[`${BEARBEITET}${i + 1}`]);
        i++;
    }
    editTableCell(dispatch, fileIndex, rowIndex, `${NOTIZ}${i}`, "");
    editTableCell(dispatch, fileIndex, rowIndex, `${BEARBEITET}${i}`, "");
};

export function isFormChecked(row) {
    const bearbeitetKeys = Object
        .keys(row)
        .filter(key => key.startsWith(BEARBEITET))
        .filter(bearbeitetKey => {
            const correspondingNotizKey = getNotizKey(bearbeitetKey);
            return row[correspondingNotizKey] !== "";
        });

    const bearbeitetValues = bearbeitetKeys.map(bearbeitetKey => row[bearbeitetKey]);

    return bearbeitetValues.every(value => value !== "") && bearbeitetValues.length > 0;
}

export function isFinished(row) {
    const keys = Object.keys(row);
    const notizKeys = keys.filter(key => key.startsWith(NOTIZ) && row[key]);

    return notizKeys.every(notizKey => {
        const correspondingBearbeitetKey = getBearbeitetKey(notizKey);
        return isNotEmpty(row, correspondingBearbeitetKey);
    });
};

export function getLatestDate(row) {
    const bearbeitetKeys = Object.keys(row).filter(key => key.startsWith("Bearbeitet-") && row[key] !== "");
    const latestDate = bearbeitetKeys.reduce((latest, key) => {
        const [day, month, year] = row[key].split(".");
        const date = new Date(`${month}/${day}/${year}`);
        return date > latest ? date : latest;
    }, new Date(0));
    return latestDate.toLocaleDateString();
};


function filterAttributes(row, bearbeitetCondition) {
    return Object.keys(row)
        .filter(bearbeitetKey => 
            bearbeitetKey.startsWith(BEARBEITET) &&
            row[getNotizKey(bearbeitetKey)] !== "" &&
            bearbeitetCondition(row[bearbeitetKey])
        );
}

export function checkAllNotes(dispatch, fileIndex, rowIndex, row) {
    const filteredAttributes = filterAttributes(row, bearbeitetValue => bearbeitetValue === "");
    filteredAttributes.forEach((e) =>
        editTableCell(dispatch, fileIndex, rowIndex, e, new Date().toLocaleDateString())
    );
};

export function uncheckAllNotes(dispatch, fileIndex, rowIndex, row) {
    const filteredAttributes = filterAttributes(row, bearbeitetValue => bearbeitetValue !== "");
    filteredAttributes.forEach((e) => 
        editTableCell(dispatch, fileIndex, rowIndex, e, "")
    );
};

export function toggleCheckNote(dispatch, fileIndex, rowIndex, notizKey, isChecked) {
    if (isChecked) {
        editTableCell(dispatch, fileIndex, rowIndex, getBearbeitetKey(notizKey), new Date().toLocaleDateString());
    }
    else {
        editTableCell(dispatch, fileIndex, rowIndex, getBearbeitetKey(notizKey), "");
    }
}; 