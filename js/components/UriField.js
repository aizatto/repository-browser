"use strict";

import React from 'react';
import PackageJsonRenderer from './PackageJsonRenderer.js';
import ComposerDotJsonRenderer from './ComposerDotJsonRenderer.js';
import {Tabs, Tab} from 'react-bootstrap';

const queryString = require('query-string');
const urlParser = require('url');
const xhr = require('xhr');
const HttpStatus = require('http-status-codes');

const axios = require('axios');

const State = {
  NONE: 'none',
  FETCHING: 'fetching',
  SUCCESS: 'success',
}

export default class UriField extends React.Component {

  constructor(props) {
    super(props);
    const parsed = queryString.parse(location.search);
    this.state = {
      uri: parsed.uri,
      state: State.NONE,
      files: {},
    }
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        GitHub Repo:
        <input
          ref="input"
          type="text"
          defaultValue={this.state.uri}
        />
        <input type="submit" value="submit" onClick={() => this.onChange()} />
        <ul>
          <li>Does not work with private repositories</li>
        </ul>
        {this.renderExamples()}
        {this.renderSucces()}
      </div>
    );
  }

  renderExamples() {
    const uris = [
      'https://github.com/kobotoolbox/kpi',
    ].map(uri => {
      const onclick = (event) => {
        event.preventDefault();
        this.refs.input.value = uri;
        this.onChange();
      };

      return (
        <li key={uri}>
          <a href={uri} onClick={onclick}>{uri}</a>
        </li>
      );
    });

    return (
      <div>
        <strong>Example</strong>
        <ul>
          {uris}
        </ul>
      </div>
    );
  }

  onChange() {
    if (!this.refs.input) {
      return;
    }

    const uri = urlParser.parse(this.refs.input.value);
    if (!(uri.protocol == 'http:' || uri.protocol == 'https:')) {
      return;
    }

    if (uri.host != 'github.com') {
      return;
    }

    const regex = /(\w+)\/(\w+)/.exec(uri.pathname);

    if (regex === null) {
      return;
    }

    const user = regex[1];
    const repo = regex[2];

    // investigate URL
    // https://github.com/kobotoolbox/kpi
    //
    // transform into
    //
    // https://github.com/kobotoolbox/kpi/blob/master/
    //
    // find
    //
    //
    // https://github.com/kobotoolbox/kpi/blob/master/package.json
    // https://github.com/kobotoolbox/kpi/blob/master/requirements.in
    // https://github.com/kobotoolbox/kpi/blob/master/.babelrc
    // https://github.com/kobotoolbox/kpi/blob/master/Dockerfile
    // https://github.com/kobotoolbox/kpi/blob/master/Gemfile
    // https://raw.githubusercontent.com/graphql/express-graphql/master/package.json
    // https://github.com/symfony/symfony/blob/master/composer.json
    //
    const output = (body) => {
      return <div><pre>{body}</pre></div>;
    };
    
    const files = {
      'package.json': (body) => {
        return (
          <div>
            <h2>package.json</h2>
            <PackageJsonRenderer json={body} />
          </div>
        );
      },
      'composer.json': (body) => {
        return (
          <div>
            <h2>composer.json</h2>
            <ComposerDotJsonRenderer json={body} />
          </div>
        );
      },
      'Dockerfile': output,
      '.dockerignore': output,
      '.eslintrc': output,
      '.bowerrc': output,
      '.gitignore': output,
      '.gitmodules': output,
      'requirements.in': output,
    };

    const raw = `https://raw.githubusercontent.com/${user}/${repo}/master/`;

    const stateFiles = {};
    for (const key in files) {
      const file = key;
      const fn = files[key];
      const fileUri = `${raw}${file}`;
      stateFiles[file] = {
        file: file,
        uri: fileUri,
        error: null,
        response: null,
        body: null,
        fn: fn,
      };
    }


    this.setState({
      uri: this.refs.input.value,
      state: State.FETCHING,
      files: stateFiles,
    }, () => {
      for (const file in files) {
        const fileUri = `${raw}${file}`;
        xhr.get(fileUri, (error, response, body) => {
          const stateFiles = this.state.files;
          console.log(file);
          console.log(error);
          console.log(response);

          stateFiles[file].error = error;
          stateFiles[file].response = response;
          stateFiles[file].body = body;

          this.setStateFiles(stateFiles);
        });
      }
    });
  }

  setStateFiles(stateFiles) {
    let i = 0;
    let total = 0;

    const state = {
      stateFiles,
    };

    for (const file in stateFiles) {
      total++;
      if (file.response || file.error) {
        i++;
      }
    }

    if (i === total) {
      state.state = State.NONE;
    }

    this.setState(state);
  }

  renderSucces() {
    if (this.state.state !== State.FETCHING) {
      return null;
    }

    const files = this.state.files;

    const html = [];
    const tabs = [];
    for (const key in files) {
      const file = files[key];

      let body = null;
      let status = null;

      console.log(file.error);
      if (file.error) {
        const error = file.error;
        body = error.stack
          ? <pre>{error.stack}</pre>
          : error.toString();

        body =(
          <div>
            <a href={file.url}>{file.uri}</a>
            {body}
          </div>
        );
        status = 'Error';
      } else if (file.response) {
        body = file.fn
          ? file.fn(file.body)
          : <pre>file.body</pre>;
        status = HttpStatus.getStatusText(file.response.statusCode);
      } else {
        body = <code>"Loading..."</code>;
        status = 'Loading';
      }

      html.push(
        <li key={file.file}>
          <a href={file.url}>{file.uri}</a>
          {' '}
          {status}
        </li>
      );

      tabs.push(
        <Tab key={file.file} eventKey={file.file} title={file.file}>
          <div>
            <a href={file.url} target="_blank">{file.uri}</a>
          </div>
          {body}
        </Tab>
      );
    }

    return (
      <Tabs defaultActiveKey={1} id="uncontrolled-tab-example">
        <Tab eventKey={1} title="General">
          <div>
            <ul>
              {html}
            </ul>
          </div>
        </Tab>
        {tabs}
      </Tabs>
    );
  }

}
