import React from 'react';

interface Props {
  json: null | string,
}

interface State {
  [config: string]: any;
}

interface Options {
  sort?: boolean,
}

export default class JsonRenderer extends React.Component<Props, State> {

  constructor(props: Props) {
    super(props);

    let config = null;
    if (this.props.json) {
      try {
        config = JSON.parse(this.props.json);
      } catch (e) { // eslint-disable-line
      }
    }

    this.state = {
      config,
    };
  }

  renderKeyStuff(
    key: string,
    fn: (value: any) => any = () => null,
  ) {
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

  renderTable(
    name: string,
    fnKey: (key: string) => any = () => null,
    fnValue: (values: any) => any = () => null,
    options: Options = {},
  ) {
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
