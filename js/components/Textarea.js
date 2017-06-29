import React from 'react';
import PackageJsonRenderer from './PackageJsonRenderer';

const State = {
  NONE: 'none',
  SUCCESS: 'success',
  EXCEPTION: 'excetpion',
};

export default class Textarea extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      exception: null,
      json: null,
      state: State.none,
    };
  }

  render() {
    return (
      <div>
        <h3>package.json or composer.json</h3>
        <textarea
          ref={(textarea) => { this.textarea = textarea; }}
          onChange={() => this.onChange()}
        />
        {this.renderState()}
      </div>
    );
  }

  onChange() {
    const value = this.textarea.value.trim();
    if (value.length === 0) {
      return;
    }

    let json = null;
    try {
      JSON.parse(value);
      json = value;
    } catch (e) {
      this.setState({
        exception: e,
        state: State.EXCEPTION,
        json: null,
      });
      return;
    }

    this.setState({
      exception: null,
      state: State.SUCCESS,
      json,
    });
  }

  renderState() {
    switch (this.state.state) {
      case State.SUCCESS:
        return this.renderSuccess();

      case State.EXCEPTION:
        return this.renderException();

      default:
      case State.NONE:
        return null;
    }
  }

  renderSuccess() {
    return (
      <div>
        <div className="alert alert-success" role="alert">
          Success
        </div>
        <PackageJsonRenderer
          json={this.state.json}
        />
      </div>
    );
  }

  renderException() {
    if (!this.state.exception) {
      return null;
    }

    return (
      <div className="alert alert-warning" role="alert">
        {this.renderStyledException()}
      </div>
    );
  }

  renderStyledException() {
    const e = this.state.exception;

    if (typeof e !== 'object') {
      return e;
    }

    const error = e.stack
      ? <pre>{e.stack}</pre>
      : <span>{e.name} {e.message}</span>;

    return (
      <div>
        {error}
      </div>
    );
  }

}
