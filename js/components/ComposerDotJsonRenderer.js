"use strict";

import React from 'react';
import JsonRenderer from './JsonRenderer.js';

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

    const code = (value) => {
      return (
        <code>{value}</code>
      );
    };

    const array_or_object = (values) => {
      if (typeof values === "string") {
        return values;
      }

      let lis = [];

      if (Array.isArray(values)) {
        lis = values.map((value, idx) => {
          return <li key={idx}>{value}</li>;
        });
      } else {
        for (const key in values) {
          const value = values[key];
          lis.push(
            <li key={key}>{value}</li>
          );
        }
      }

      return <ul>{lis}</ul>;
    }

    return (
      <div>
        {this.renderStuff()}
        {this.renderTable('autoload', code, array_or_object)}
        {this.renderTable('autoload-dev', code, array_or_object)}
        {this.renderTable('require', depName)}
        {this.renderTable('replace', depName)}
        {this.renderTable('require-dev', depName)}
        {this.renderTable('extra', depName, array_or_object)}
        {this.renderTable('scripts', code, array_or_object)}
        <pre>{this.props.json}</pre>
      </div>
    );
  }

  renderStuff() {
    const code = (value) => {
      return (
        <code>{value}</code>
      );
    };
    
    let stuff = [
      this.renderKeyStuff('name', code),
      this.renderKeyStuff('license'),
      this.renderKeyStuff('type'),
      this.renderKeyStuff('homepage', (uri) => {
        return <a href={uri}>{uri}</a>
      }),

      this.renderKeyStuff('version'),
      this.renderKeyStuff('description'),
      this.renderKeyStuff('author'),
      this.renderKeyStuff('main', code),
    ];

    stuff = stuff.filter((value) => value !== null);
    if (stuff.length === 0) {
      return;
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
