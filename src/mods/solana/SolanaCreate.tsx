import React, { useState } from 'react';
import ReactSimpleCodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

import useParams from './useParams';
import Preview from './Preview';
import {getFormData} from "./getFormData";

export default function Solana() {
  const [address] = useParams();
  const [tab, setTab] = useState('edit');
  const [code, setCode] = useState('');

  const tabs = (
    <div className="button-group">
      <button onClick={() => setTab('edit')}>Edit</button>
      <button onClick={() => setTab('preview')}>Preview</button>
    </div>
  );

  switch (tab) {
    case 'preview':
      return (<>
        {tabs}
        <Preview/>
      </>);
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const {name, context, code} = getFormData(e);
    const formData = {
      name,
      [context]: code
    }

    fetch('http://localhost:3100/test',{
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({...formData, address}),
    }).then(res => console.log(res));
  };
  // const [Component, loading, data] = useAccountComponent(address, 'react', name);
  return (<>
    {tabs}
    <form onSubmit={onSubmit}>
      <fieldset>
        <legend>Simple form</legend>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="username">context</label>
            <select name="context" id="context" placeholder="context" >
              <option value="react">React</option>
            </select>
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6">
            <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="name">Name</label>
            <input name="name" type="text" id="name" placeholder="name" />
          </div>
        </div>
        <div className="row">
          <div className="col-sm-12 col-md-6" style={{ display: 'flex' }}>
            <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="code">Code</label>
            <div style={{ display: 'inline-block' }}>
              <ReactSimpleCodeEditor
                name="code"
                value={code}
                onValueChange={(code) => setCode(code)}
                highlight={(code) => highlight(code, languages.js)}
                padding={10}
                style={{
                  minHeight: 200,
                  width: 400,
                  fontSize: 14,
                  background: '#F8F8F8',
                  border: '1px solid rgb(221, 221, 221)',
                  margin: 'calc(var(--universal-margin) / 2)',
                  borderRadius: 'var(--universal-border-radius)',
                }}
              />
            </div>
          </div>
        </div>
        <button type="submit" className="primary">Save</button>
      </fieldset>
    </form>
  </>);
}
