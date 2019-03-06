import React from 'react';
import { Tabs, Tab } from 'aizatto/lib/react/bootstrap';
import PackageJsonRenderer from './PackageJsonRenderer';
import ComposerDotJsonRenderer from './ComposerDotJsonRenderer';

const queryString = require('query-string');
const urlParser = require('url');
const xhr = require('xhr');
const HttpStatus = require('http-status-codes');

const State = {
  NONE: 'none',
  FETCHING: 'fetching',
  SUCCESS: 'success',
};

interface Props {

}

interface UriFieldState {
  uri: string;
  state: string;
  [files: string]: any
}

interface StateFiles {
  [index:string]: {
    file: string;
    uri: string;
    error: null;
    response: null;
    body: null;
    fn: any;
  }
};

export default class UriField extends React.Component<Props, UriFieldState> {

  input: any = null;

  constructor(props: Props) {
    super(props);
    // eslint-disable-next-line no-undef
    const parsed = queryString.parse(location.search);
    this.state = {
      uri: parsed.uri,
      state: State.NONE,
      files: {},
    };
  }

  componentDidMount() {
  }

  render() {
    return (
      <div>
        GitHub Repo:
        <input
          ref={(input) => { this.input = input; }}
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
    ].map((uri) => {
      const onclick = (event: React.MouseEvent<HTMLElement>) => {
        event.preventDefault();
        this.input.value = uri;
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
    if (!this.input) {
      return;
    }

    const uri = urlParser.parse(this.input.value);
    if (!(uri.protocol === 'http:' || uri.protocol === 'https:')) {
      return;
    }

    if (uri.host !== 'github.com') {
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
    const output = (body: string) => <div><pre>{body}</pre></div>;

    const files = {
      'package.json': (body: string) => (
        <div>
          <h2>package.json</h2>
          <PackageJsonRenderer json={body} />
        </div>
        ),
      'composer.json': (body: string) => (
        <div>
          <h2>composer.json</h2>
          <ComposerDotJsonRenderer json={body} />
        </div>
        ),
      Dockerfile: output,
      '.dockerignore': output,
      '.eslintrc': output,
      '.bowerrc': output,
      '.gitignore': output,
      '.gitmodules': output,
      'requirements.in': output,
    };

    const raw = `https://raw.githubusercontent.com/${user}/${repo}/master/`;

    const stateFiles: StateFiles = {};
    Object.entries(files).forEach(([file, fn]) => {
      const fileUri = `${raw}${file}`;
      stateFiles[file] = {
        file,
        uri: fileUri,
        error: null,
        response: null,
        body: null,
        fn,
      };
    });

    this.setState({
      uri: this.input.value,
      state: State.FETCHING,
      files: stateFiles,
    }, () => {
      Object.keys(files).forEach((file) => {
        const fileUri = `${raw}${file}`;
        xhr.get(fileUri, (error: string, response: string, body: string) => {
          const sF = this.state.files;
          sF[file].error = error;
          sF[file].response = response;
          sF[file].body = body;

          this.setStateFiles(stateFiles);
        });
      });
    });
  }

  setStateFiles(stateFiles: StateFiles) {
    const state = {
      stateFiles,
    };

    this.setState(state);
  }

  renderSucces() {
    if (this.state.state !== State.FETCHING) {
      return null;
    }

    const files = this.state.files;

    const html: JSX.Element[] = [];
    const tabs = Object.keys(files).map((key) => {
      const file = files[key];

      let body: any = null;
      let status: any = null;

      if (file.error) {
        const error = file.error;
        body = error.stack
          ? <pre>{error.stack}</pre>
          : error.toString();

        body = (
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
        body = <code>Loading...</code>;
        status = 'Loading';
      }

      html.push(
        <li key={file.file}>
          <a href={file.url}>{file.uri}</a>
          {' '}
          {status}
        </li>,
      );

      return (
        <Tab
          key={file.file}
          eventKey={file.file}
          title={file.file}
          render={() =>
            (<div>
              <div>
                <a href={file.url} target="_blank">{file.uri}</a>
              </div>
              {body}
            </div>)
          }
        />
      );
    });

    return (
      <Tabs>
        <Tab
          eventKey="general"
          title="General"
          render={() =>
            (<div>
              <ul>
                {html}
              </ul>
            </div>)
          }
        />
        {tabs}
      </Tabs>
    );
  }

}
