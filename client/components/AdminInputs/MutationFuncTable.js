/* eslint max-len: 0 */
/* eslint no-console: 0 */
import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';


const jobs = [];
const jobTypes = ['Cross-over', 'Selection-two', 'Selection-three', 'Selection-four'];

function addJobs(quantity) {
  const startId = jobs.length;
  for (let i = 0; i < quantity; i++) {
    const id = startId + i;
    jobs.push({
      id: id,
      status: '20%',
      type: 'Cross-over',
    });
  }
}

addJobs(5);

const cellEditProp = {
  mode: 'click',
  blurToSave: true
};

// validator function pass the user input value and should return true|false.
function jobNameValidator(value) {
  const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };
  if (!value) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Value must be inserted';
    response.notification.title = 'Requested Value';
  } else if (value.length < 10) {
    response.isValid = false;
    response.notification.type = 'error';
    response.notification.msg = 'Value must have 10+ characters';
    response.notification.title = 'Invalid Value';
  }
  return response;
}

function jobStatusValidator(value) {
  const nan = isNaN(parseInt(value, 10));
  if (nan) {
    return 'Job Status must be a integer!';
  }
  return true;
}

export default class MutationFuncTable extends React.Component {

  invalidJobStatus = (cell, row) => {
    console.log(`${cell} at row id: ${row.id} fails on editing`);
    return 'invalid-jobstatus-class';
  }

  editingJobStatus = (cell, row) => {
    console.log(`${cell} at row id: ${row.id} in current editing`);
    return 'editing-jobstatus-class';
  }

  render() {
    return (
      <BootstrapTable data={jobs} cellEdit={cellEditProp} insertRow={true}>
        <TableHeaderColumn hidden dataField='id' isKey={true}>Job ID</TableHeaderColumn>
        <TableHeaderColumn dataField='type' editable={{ type: 'select', options: { values: jobTypes } }}>Mutation Function</TableHeaderColumn>
        <TableHeaderColumn dataField='status' editable={{ validator: jobStatusValidator }} editColumnClassName={this.editingJobStatus} invalidEditColumnClassName={this.invalidJobStatus}> Chance of Mutation</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
