import React, { Component } from 'react';
import Textarea from './components/Textarea';
import UriField from './components/UriField';

class App extends Component {
  render() {
    return (
      <div className="container">
        <h1>Packages</h1>
        <UriField />

        <Textarea />

        <h3>Notes</h3>
        package.json:
        <ul>
          <li>
            <a href="https://docs.npmjs.com/files/package.json">
Specifics of npm
              {"'"}
s package.json handling
            </a>
          </li>
          <li><a href="https://github.com/npm/read-package-json">read-package-json</a></li>
          <li><a href="http://browsenpm.org/package.json">package.json Interactive Guide</a></li>
        </ul>

        composer.json
        <ul>
          <li><a href="https://getcomposer.org/doc/04-schema.md">composer schema</a></li>
          <li><a href="https://packagist.org/apidoc">api</a></li>
        </ul>
      </div>
    );
  }
}

export default App;
