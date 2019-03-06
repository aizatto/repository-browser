import React, { useEffect, useState, useRef } from 'react';
import { Tabs, Tab } from 'aizatto/lib/react/bootstrap';
import PackageJsonRenderer from './PackageJsonRenderer';
import ComposerDotJsonRenderer from './ComposerDotJsonRenderer';
import { groupBy } from 'lodash';

const queryString = require('query-string');
const urlParser = require('url');

enum Status {
  SUCCESS,
  ERROR,
}

function RenderExamples(props: { inputRef: any }) {
  const { inputRef } = props;
  const uris = [
    'https://github.com/kobotoolbox/kpi',
  ].map((uri) => {
    const onClick = (event: React.MouseEvent<HTMLElement>) => {
      event.preventDefault();
      if (!inputRef ||
          !inputRef.current) {
        return;
      }

      inputRef.current.value = uri;
    }

    return (
      <li key={uri}>
        <a href={uri} onClick={onClick}>{uri}</a>
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

interface FileConfig {
  name: string,
  uri: string,
  body: string,
  status: Status,
}

function forEachGroup(group: FileConfig[], fn: (file:FileConfig) => void) {
  const sortedGroup = group.sort((a, b) => a.name.localeCompare(b.name))
  sortedGroup.map((file) => fn(file));
}

function RenderFile(props: {file:FileConfig}): JSX.Element {
  const file = props.file;
  switch (file.name) {
    case 'composer.json': 
      return (
        <>
          <h2>composer.json</h2>
          <ComposerDotJsonRenderer json={file.body} />
        </>
      );

    case 'package.json':
      return (
        <>
          <h2>package.json</h2>
          <PackageJsonRenderer json={file.body} />
        </>
      );

    default:
      return <div><pre>{file.body}</pre></div>;
  }
}

function RenderSuccess(props: {uri?: string | null }) {
  const defaultFile: FileConfig[] = [];
  const [files, setFiles] = useState(defaultFile);

  const { uri } = props;

  const fetchFiles = async () => {
    if (!uri) {
      return;
    }

    const parsedUri = urlParser.parse(uri);
    if (!(parsedUri.protocol === 'http:' ||
          parsedUri.protocol === 'https:')) {
      return;
    }

    if (parsedUri.host !== 'github.com') {
      return;
    }

    const regex = /(\w+)\/([^\/]+)/.exec(parsedUri.pathname);

    if (regex === null) {
      return;
    }

    const user = regex[1];
    const repo = regex[2];

    const root = `https://raw.githubusercontent.com/${user}/${repo}/master/`;
    const files = [
      '.bowerrc',
      '.dockerignore',
      '.eslintrc',
      '.gitignore',
      '.gitmodules',
      'Dockerfile',
      'README.md',
      'composer.json',
      'package.json',
      'requirements.in',
      'tsconfig.json',
    ];

    let state:FileConfig[] = [];
    const promises = files.map(async (file) => {
      const fileUri = `${root}${file}`;
        const response = await fetch(fileUri);
        const body = await response.text();
        state.push({
          name: file,
          uri: fileUri,
          body,
          status: response.ok ? Status.SUCCESS : Status.ERROR,
        });
    });

    await Promise.all(promises);
    setFiles(state);
  }

  useEffect(() => { fetchFiles() }, [uri]);

  const html: JSX.Element[] = [];
  const tabs: JSX.Element[] = [];

  const groups = groupBy(files, 'status');
  if (groups[Status.SUCCESS]) {
    forEachGroup(groups[Status.SUCCESS], (file) => {
      html.push(
        <li key={file.name}>
          <a href={file.uri}>{file.uri}</a>
        </li>
      );

      tabs.push(
        <Tab
          key={file.name}
          eventKey={file.name}
          title={file.name}
          render={() =>
            (<div>
              <div>
                <a href={file.uri} target="_blank">{file.uri}</a>
              </div>
              <RenderFile file={file} />
            </div>)
          }
        />
      );
    });
  }

  if (groups[Status.ERROR]) {
    forEachGroup(groups[Status.ERROR], (file) => {
      html.push(
        <li key={file.name}>
          {file.uri}
        </li>
      );

      tabs.push(
        <Tab
          key={file.name}
          eventKey={file.name}
          title={file.name}
        />
      );
    });
  }

  return (
    <Tabs>
      <Tab
      eventKey="general"
      title="General"
      render={() =>
        (<>
            <ul>
              {html}
          </ul>
          </>)
      }
      />
      {tabs}
    </Tabs>
  );
}

export default function UriField() {
  const [uri, setURI] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const onClick = () => {
    if (!inputRef ||
        !inputRef.current) {
      return;
    }

    setURI(inputRef.current.value);
  }

  return (
    <div>
      GitHub Repo:
      <input
        ref={inputRef}
        type="text"
      />
      <input type="submit" value="submit" onClick={onClick} />
      <ul>
        <li>Does not work with private repositories</li>
      </ul>
      <RenderExamples inputRef={inputRef} />
      <RenderSuccess uri={uri} />
    </div>
  );
}
