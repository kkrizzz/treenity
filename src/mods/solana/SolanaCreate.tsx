import React, { useState } from 'react';
import ReactSimpleCodeEditor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

import useParams from './useParams';
import Preview from './Preview';
import { getFormData } from './getFormData';
import StorageManager from './storageInterface';

export default function Solana({view, accountData}) {
  const [address, viewName] = useParams();
  const [tab, setTab] = useState('edit');
  const [code, setCode] = useState(view?.['react'] || '');

  const tabs = (
    <div className="button-group">
      <button className={tab=='edit'?'primary':''} onClick={() => setTab('edit')}>Edit</button>
      <button className={tab=='preview'?'primary':''} onClick={() => setTab('preview')}>Preview</button>
    </div>
  );

  switch (tab) {
    case 'preview':
      return (
        <>
          {tabs}
          <Preview accountData={accountData} code={code}/>
        </>
      );
  }

  const onSubmit = (e) => {
    e.preventDefault();
    const { context, code } = getFormData(e);
    const formData = {
      name: viewName,
      [context]: code,
    };

    if(view) {
      StorageManager.patchView(view._id,{...formData, address}).catch(alert)
    }else {
      StorageManager.createView({...formData, address}).catch(alert)
    }
  };

  return (
    <>
      {tabs}
      <form onSubmit={onSubmit}>
        <fieldset>
          <legend>Simple form</legend>
          <div className="row">
            <div className="col-sm-12 col-md-6">
              <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="username">
                Context
              </label>
              <select name="context" id="context" placeholder="Context">
                <option value="react">React</option>
                <option value="react">Cell</option>
                <option value="react">List</option>
                <option value="react">Card</option>
                <option value="react">Thumbnail</option>
                <option value="react">Icon</option>
              </select>
            </div>
          </div>
          <div className="row">
            <div className="col-sm-12 col-md-6" style={{ display: 'flex' }}>
              <label style={{ minWidth: 100, display: 'inline-block' }} htmlFor="code">
                Code
              </label>
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
          <button type="submit" className="primary">
            Save
          </button>
        </fieldset>
      </form>
    </>
  );
}
