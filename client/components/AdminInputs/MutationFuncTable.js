import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios'

export default class MutationFuncTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      mutationFuncs: []
    }
  }

  componentDidMount() {
    this.fetchMutuationAlgorithms()
  }

  onAfterSaveCell(row, cellName, cellValue) {
    const newMutations = this.props.functions.filter(func => row.id === func.id)
    this.props.submit({
      preventDefault: () => { },
      target: {
        value: [...newMutations, row]
      }
    })
  }

  fetchMutuationAlgorithms() {
    axios.get('/api/mutation-algs')
      .then(funcs => this.setState({ mutationFuncs: funcs.data }))
  }

  addMutationFuncsToDropDown() {
    return this.state.mutationFuncs.map(mut => {
      return mut.name
    })
  }

  functionNameValidator(value) {
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

  chanceOfMutationValidator(value) {
    const nan = isNaN(value);
    if (nan) return 'Job Status must be a integer.'
    else if (value > 1) return 'Chance of mutation must be less than one.'
    else if (value < 0) return 'Chance of mutation must be more than zero.'
    return true;
  }

  invalidChanceOfMutation = (cell, row) => {
    console.log(`${cell} at row id: ${row.id} fails on editing`);
  }

  editingChanceOfMutation = (cell, row) => {
    console.log(`${cell} at row id: ${row.id} in current editing`);
  }

  render() {
    return (
      <BootstrapTable data={this.props.functions} cellEdit={{
        mode: 'click',
        blurToSave: true,
        afterSaveCell: this.onAfterSaveCell.bind(this)
      }} insertRow={true}>
        <TableHeaderColumn
          hidden
          dataField='id'
          isKey={true}
        >Job ID</TableHeaderColumn>
        <TableHeaderColumn
          dataField='name'
          editable={{
            type: 'select', options: {
              values: this.addMutationFuncsToDropDown(),
              validator: this.functionNameValidator
            }
          }}>Mutation Function</TableHeaderColumn>
        <TableHeaderColumn
          dataField='chanceOfMutation' editable={{ validator: this.chanceOfMutationValidator }} editColumnClassName={this.editingChanceOfMutation} invalidEditColumnClassName={this.invalidChanceOfMutation}
        > Chance of Mutation</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
