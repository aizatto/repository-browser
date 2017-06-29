

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
    } catch (e) { // eslint-disable-line
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

  renderTable(name, fnKey, fnValue, options = {}) {
    const values = this.state.config[name];
    if (!values) {
      return null;
    }

    const keys = Object.keys(values);
    if (options.sort) {
      keys.sort();
    }

    const rows = keys.map((key) => {
      const value = values[key];

      const key2 = fnKey ? fnKey(key) : key;
      const value2 = fnValue ? fnValue(value) : value;

      return (
        <tr key={key}>
          <td>
            {key2}
          </td>
          <td>{value2}</td>
        </tr>
      );
    });

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
            {rows}
          </tbody>
        </table>
      </div>
    );
  }

}
