//@flow

import React, { Component } from 'react';
import ControlArea from './ControlArea';
import ResultTable from './ResultTable';
import Charts from './Charts';
import './App.css';

class App extends Component {
  state = {
    records: [],
    field: "PatentOwner",
    value: "Personalized",
    table: "temp:killed",
    fields: [],
    tables: [],
    count: 0,
    totalClaims: 0,
    uniqueClaims: 0,
    survival: [],
    mode: 'chart',
    cursor: 0
  }

  componentDidMount() {
    fetch('/users/fields')
      .then(res => res.json())
      .then(fields => this.setState({ fields }))
    fetch('/users/tables')
      .then(res => res.json())
      .then(tables => this.setState({ tables }))
    fetch(`/users/run?field=${this.state.field}&value=${this.state.value}&cursor=${this.state.cursor}&table=${encodeURIComponent(this.state.table)}`)
      .then(res => res.json())
      .then(records => {
        this.setState({ cursor: records.cursor, count: records.count, records: records.data })
      })
    fetch('/users/survival')
      .then(res => res.json())
      .then(results => {
        this.setState({
          totalClaims: results.totalClaims,
          uniqueClaims: results.uniqueClaims,
          survival: results.survival
        })
      })
  }

  selectTable = (event) => {
    console.log('new table selected %s', event.target.value);
    this.setState({ table: event.target.value });
  }

  selectField = (event) => {
    console.log('new field selected %s', event.target.value);
    this.setState({ field: event.target.value });
  }

  setValue = (event) => {
    console.log('new value %s', event.target.value);
    this.setState({ value: event.target.value });
  }

  newQuery = () => {
    console.log('request for new query of %s where %s=%s', this.state.table, this.state.field, this.state.value)
    fetch(`/users/run?field=${this.state.field}&value=${this.state.value}&table=${encodeURIComponent(this.state.table)}`)
      .then(res => res.json())
      .then(records => {
        this.setState({ count: records.count, records: records.data })
      })

  }

  switchMode = () => {
    console.log('request for mode switch');
    let mode = this.state.mode;
    mode === 'table' ? mode = 'chart' : mode = 'table';
    this.setState({ mode });
  }

  render() {
    const viewArea = this.state.mode === 'table'
      ? (<ResultTable records={this.state.records} />)
      : (<Charts totalClaims={this.state.totalClaims} uniqueClaims={this.state.uniqueClaims} survival={this.state.survival} />)
    return (
      <div className="App">
        <ControlArea
          value={this.state.value}
          tables={this.state.tables}
          fields={this.state.fields}
          table={this.state.table}
          field={this.state.field}
          count={this.state.count}
          mode={this.state.mode}
          selectTable={this.selectTable}
          selectField={this.selectField}
          newQuery={this.newQuery}
          setValue={this.setValue}
          switchMode={this.switchMode}
        />
        {viewArea}
      </div>
    );
  }
}

export default App;
