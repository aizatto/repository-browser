import React from 'react';
import JsonRenderer from './JsonRenderer';

export default class ComposerDotJsonRenderer extends JsonRenderer {

  render() {
    if (!this.state.config) {
      return (
        <pre>{this.props.json}</pre>
      );
    }

    const depName = (name) => {
      const uri = `https://packagist.org/packages/${name}/`;
      return (
        <a href={uri}>
          {name}
        </a>
      );
    };

    const code = value => (
      <code>{value}</code>
      );

    const arrayOrObject = (values) => {
      if (typeof values === 'string') {
        return values;
      }

      let lis = [];

      if (Array.isArray(values)) {
        lis = values.map(value => <li key={value}>{value}</li>);
      } else {
        lis = Object.keys(values).map((key) => {
          const value = values[key];
          return (
            <li key={key}>{value}</li>
          );
        });
      }

      return <ul>{lis}</ul>;
    };

    return (
      <div>
        {this.renderStuff()}
        {this.renderTable('autoload', code, arrayOrObject)}
        {this.renderTable('autoload-dev', code, arrayOrObject)}
        {this.renderTable('require', depName)}
        {this.renderTable('replace', depName)}
        {this.renderTable('require-dev', depName)}
        {this.renderTable('extra', depName, arrayOrObject)}
        {this.renderTable('scripts', code, arrayOrObject)}
        <pre>{this.props.json}</pre>
      </div>
    );
  }

  renderStuff() {
    const code = value => (
      <code>{value}</code>
      );

    let stuff = [
      this.renderKeyStuff('name', code),
      this.renderKeyStuff('license'),
      this.renderKeyStuff('type'),
      this.renderKeyStuff('homepage', uri => <a href={uri}>{uri}</a>),

      this.renderKeyStuff('version'),
      this.renderKeyStuff('description'),
      this.renderKeyStuff('author'),
      this.renderKeyStuff('main', code),
    ];

    stuff = stuff.filter(value => value !== null);
    if (stuff.length === 0) {
      return null;
    }

    return (
      <div>
        <h3>General</h3>
        <table className="table">
          <tbody>
            {stuff}
          </tbody>
        </table>
      </div>
    );
  }

}
