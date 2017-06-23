"use strict";

import React from 'react';
import JsonRenderer from './JsonRenderer.js';
import clipboard from 'copy-to-clipboard';

export default class PackageJsonRenderer extends JsonRenderer {

  render() {
    if (!this.state.config) {
      return (
        <pre>{this.props.json}</pre>
      );
    }

    const depName = (name) => {
      const uri = `https://www.npmjs.com/package/${name}`;
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

    return (
      <div>
        {this.renderStuff()}
        {this.renderTable('dependencies', depName)}
        {this.renderTable('devDependencies', depName)}
        {this.renderTable('peerDependencies', depName)}
        {this.renderTable('scripts', code, code, { sort: true })}
        {this.renderTable('bin', code, code, { sort: true })}
        {this.renderTable('options', code, code)}
        {this.renderTable('directories', code, code)}
        {this.renderTable('repository')}
        {this.renderTable('bugs')}
        <h3>File Contents</h3>
        <pre>{this.props.json}</pre>
        {this.renderYarnAdd()}
        {this.renderYarnAddDev()}
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
      this.renderKeyStuff('version'),
      this.renderKeyStuff('description'),
      this.renderKeyStuff('author'),
      this.renderKeyStuff('homepage', (uri) => {
        return <a href={uri}>{uri}</a>
      }),
      this.renderKeyStuff('license'),
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

  renderYarnAdd() {
    const deps = this.state.config.dependencies
    return this.renderCommand(['yarn', 'add'], deps);
  }

  renderYarnAddDev() {
    const deps = this.state.config.devDependencies
    return this.renderCommand(['yarn', 'add', '--dev'], deps);
  }

  renderCommand(command, deps) {
    if (!deps || deps.length === 0) {
      return null;
    }

    // TODO: add flag for version numbers
    const keys = Object.keys(deps);
    deps = keys.map((dep, index) => {
      const separator = index === keys.length -1 ? "\n" : "\\";
      return `  ${dep} ${separator}`
    }).join("\n");

    const fullCommand = `${command.join(' ')} \\\n${deps}`;

    const copy = (
      <small
        style={{ cursor: 'pointer'}}
        onClick={() => clipboard(fullCommand)}>
        copy
      </small>
    );

    return (
      <div>
        <h4>{command.join(' ')}{' '}{copy}</h4>
        <pre>{fullCommand}</pre>
      </div>
    );
  }

}
