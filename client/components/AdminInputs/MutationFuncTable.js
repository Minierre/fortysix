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

    const newMutations = this.props.functions.map(mut => {
      // Since we can't have duplicates from table validation we knowwe are updating a row
      if (row.mutationId === mut.mutationId) {
        return { ...mut, chanceOfMutation: mut.chanceOfMutation }
      }
      return mut
    })

    const newRow = () => this.props.functions.every(func => func.name !== cellValue)

    this.props.submit({
      preventDefault: () => { },
      target: {
        value: newRow() ? [...newMutations, row] : newMutations
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

  functionNameValidator(newVal, previousVal) {
    const response = { isValid: true, notification: { type: 'success', msg: '', title: '' } };

    const isDuplicate = () => {
        return this.props.functions
          .filter(func => func.name !== previousVal.name)
          .some(func => func.name === newVal)
    }

    if (!newVal) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Value must be inserted';
      response.notification.title = 'Requested Value';
    } else if (newVal.length < 10) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'Value must have 10+ characters';
      response.notification.title = 'Invalid Value';
    } else if (isDuplicate()) {
      response.isValid = false;
      response.notification.type = 'error';
      response.notification.msg = 'You can\'t have the same function twice';
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

  render() {
    return (
      <BootstrapTable data={this.props.functions} cellEdit={{
        mode: 'click',
        blurToSave: true,
        afterBeforeCell: this.onAfterSaveCell.bind(this)
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
            },

            validator: this.functionNameValidator.bind(this)
          }}>Mutation Function</TableHeaderColumn>
        <TableHeaderColumn
          dataField='chanceOfMutation'
          editable={{ validator: this.chanceOfMutationValidator }}
        > Chance of Mutation</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
