/**
 * Fix the evidenceData when for some reason there are fields in evidenceForm 
 * that do not have a corresponding item in the evidenceData array.
 * 
 * This may happen when a user created a claim with a given Form and AFTERWARDS
 * the Admin adds some field to the same Form. In this case the evidence data
 * entered by the user will not have the newly added field.
 * 
 * The same may happen if Admin deletes some field from the evidenceForm. In 
 * this case the evidenceForm array and the evidenceData array will mismatch 
 * and so we need to fix this.
 * 
 * @MAZ - 2023-03-01
 */
export function fixEvidenceData(evidenceForm, evidenceData) {

  // build a dictio for the existent evidenceData items 
  let dictio = Object.fromEntries(evidenceData.map((x) => [x.id, x]));

  let fixedData = evidenceForm.map((field) => {
    // check if we have the corresponding field in evidenceData
    if (!dictio[field.id]) {
      // we have no data item for this field !!!
      let item = Object.assign({}, field);
      item.value = null;
      return item;
    }
    return dictio[field.id];
  })
   
  return fixedData;
}
