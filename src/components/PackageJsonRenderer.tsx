import React from 'react';
import clipboard from 'copy-to-clipboard';
import JsonRenderer from './JsonRenderer';

export default class PackageJsonRenderer extends JsonRenderer {

  render() {
    if (!this.state.config) {
      return (
        <pre>{this.props.json}</pre>
      );
    }

    const depName = (name: string) => {
      const uri = `https://www.npmjs.com/package/${name}`;
      return (
        <a href={uri}>
          {name}
        </a>
      );
    };

    const code = (value: string) => (
      <code>{value}</code>
      );

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
        <h3>File Contents</h3>
        <pre>{this.props.json}</pre>
        {this.renderYarnAdd()}
        {this.renderYarnAddDev()}
      </div>
    );
  }

  renderStuff() {
    const code = (value: string) => (
      <code>{value}</code>
      );

    const url = (uri: string) => <a href={uri}>{uri}</a>;

    let stuff = [
      this.renderKeyStuff('name', code),
      this.renderKeyStuff('version'),
      this.renderKeyStuff('description'),
      this.renderKeyStuff('author'),
      this.renderKeyStuff('homepage', url),
      this.renderKeyStuff('license'),
      this.renderKeyStuff('main', code),
      this.renderKeyStuff('repository', url),
      this.renderKeyStuff('bugs', url),
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

  renderYarnAdd() {
    const deps = this.state.config.dependencies;
    return this.renderCommand(['yarn', 'add'], deps);
  }

  renderYarnAddDev() {
    const deps = this.state.config.devDependencies;
    return this.renderCommand(['yarn', 'add', '--dev'], deps);
  }

  // eslint-disable-next-line class-methods-use-this
  renderCommand(command: string[], deps: any) {
    if (!deps || deps.length === 0) {
      return null;
    }

    // TODO: add flag for version numbers
    const keys = Object.keys(deps);
    const depString = keys.map((dep, index) => {
      const separator = index === keys.length - 1 ? '\n' : '\\';
      return `  ${dep} ${separator}`;
    }).join('\n');

    const fullCommand = `${command.join(' ')} \\\n${depString}`;

    const copy = (
      <small
        style={{ cursor: 'pointer' }}
        onClick={() => clipboard(fullCommand)}
        role="button"
        tabIndex={-1}
      >
        copy
      </small>
    );

    return (
      <div>
        <h4>
          {command.join(' ')}
          {' '}
          {copy}
        </h4>
        <pre>{fullCommand}</pre>
      </div>
    );
  }

}
