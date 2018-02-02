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

  onBeforeSaveCell(row, cellName, cellValue) {
    // console.log(row, cellName, cellValue)
  }

  onAfterSaveCell(row, cellName, cellValue) {
    // console.log(row, cellName, cellValue)

    //iterate through this.props to figure out what is

    // const oldFunction =
    //   this.props.functions.filter(func => row.id !== func.id)
    // console.log('OLD: ', oldFunction)
    // console.log('NEW: ', cellValue)
    this.props.submit({
      preventDefault: () => { },
      target: {
        value: {mutationFunctionId: row.id, }
      }
    })
  }

  fetchMutuationAlgorithms() {
    axios.get('/api/mutation-algs')
      .then(funcs => {
        this.setState({ mutationFuncs: funcs.data })
        // console.log('STATE: ', this.state.mutationFuncs)

      })
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

  onCellClick(a, b, c) {
      console.log(a,b,c)
    }

    render() {
      // console.log('PROPS: ', this.props.functions)
      return (
      <BootstrapTable data={this.props.functions} cellEdit={{
        mode: 'click',
        onBlur: this.onCellClick.bind(this),
        blurToSave: true,
        afterSaveCell: this.onAfterSaveCell.bind(this),
        beforeSaveCell: this.onBeforeSaveCell.bind(this)
      }} insertRow={true}>
        <TableHeaderColumn
          hiddenOnInsert
          autoValue
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
