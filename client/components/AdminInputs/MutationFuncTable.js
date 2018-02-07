import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import axios from 'axios'
import differenceBy from 'lodash/differenceBy'

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

    const value = this.props.functions.map(fn => {
      if (fn.mutationId !== row.mutationId) return fn
      const newFn = { ...fn, chanceOfMutation: row.chanceOfMutation }
      return fn
    })

    this.props.submit({
      preventDefault: () => { },
      target: {
        name: 'mutations',
        value
      }
    })
  }

  onAfterInsertRow(row) {
    const id = this.state.mutationFuncs.find(mut => mut.name === row.name).id
    this.props.onChange({
      persist: () => { },
      target: {
        name: 'mutations',
        value: this.props.functions.concat([{
          id,
          name: row.name,
          mutationId: id,
          chanceOfMutation: row.chanceOfMutation
        }])
      }
    })

    // HACK: This is to fix a race condition that causes Formik to not update
    // when the modal form is submitted.
    setImmediate(() => {
      this.props.submit({
        preventDefault: () => { },
        target: {
          name: 'mutations',
          value: this.props.functions.concat([{
            id,
            name: row.name,
            mutationId: id,
            chanceOfMutation: row.chanceOfMutation
          }])
        }
      })
    })
  }

  fetchMutuationAlgorithms() {
    axios.get('/api/mutation-algs')
      .then(funcs => this.setState({ mutationFuncs: funcs.data }))
  }

  MutationFuncSelect(column, attr, editorClass, ignoreEditable, defaultValue) {
    return (
      <select className={`${editorClass}`} { ...attr }>
        {
          differenceBy(this.state.mutationFuncs, this.props.functions, 'id').map(
            func =>
              (<option key={func.id} value={func.name}>{func.name}</option>)
          )
        }
      </select>
    )
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

  onAfterDeleteRow(rowKeys) {
    alert('The rowkey you drop: ' + rowKeys);
  }

  render() {
    return (
      <BootstrapTable
        data={this.props.functions}
        options={{ afterInsertRow: this.onAfterInsertRow.bind(this) }}
        cellEdit={{
          mode: 'click',
          blurToSave: true,
          afterSaveCell: this.onAfterSaveCell.bind(this),
          afterDeleteRow: this.onAfterDeleteRow.bind(this)
        }}
        selectRow={{
          mode: 'checkbox'
        }}
        deleteRow={true}
        insertRow={true}>
        <TableHeaderColumn
          autoValue
          hidden
          dataField='id'
          isKey={true}
        >Job ID</TableHeaderColumn>
        <TableHeaderColumn
          dataField='name'
          customInsertEditor={
            { getElement: this.MutationFuncSelect.bind(this) }
          }
        >Mutation Function</TableHeaderColumn>
        <TableHeaderColumn
          dataField='chanceOfMutation' editable={{ validator: this.chanceOfMutationValidator }}
          editColumnClassName={this.editingChanceOfMutation}
          invalidEditColumnClassName={this.invalidChanceOfMutation}
        > Chance of Mutation</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}
