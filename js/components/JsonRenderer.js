"use strict";

import React from 'react';

export default class JsonRenderer extends React.Component {

  static propTypes = {
    json: React.PropTypes.string.isRequired,
  }

  constructor(props) {
    super(props);

    let config = null;
    try {
      config = JSON.parse(this.props.json);
    } catch (e) {
    }

    this.state = {
      config,
    };
  }

  renderKeyStuff(key, fn) {
    if (!this.state.config[key]) {
      return null;
    }

    let value = this.state.config[key];
    value = fn ? fn(value) : value;

    return (
      <tr key={key}>
        <td>{key}</td>
        <td>{value}</td>
      </tr>
    );
  }

  renderTable(name, fn_key, fn_value) {
    const values = this.state.config[name];
    if (!values) {
      return;
    }

    const keys = [];
    for (const key in values) {
      const value = values[key];

      const key2 = fn_key ? fn_key(key) : key;
      const value2 = fn_value ? fn_value(value) : value;

      keys.push(
        <tr key={key}>
          <td>
            {key2}
          </td>
          <td>{value2}</td>
        </tr>
      );
    }

    return (
      <div>
        <h3>{name}</h3>
        <table className="table">
          <thead>
            <tr>
              <td>Name</td>
              <td>Version</td>
            </tr>
          </thead>
          <tbody>
            {keys}
          </tbody>
        </table>
      </div>
    );
  }

}
