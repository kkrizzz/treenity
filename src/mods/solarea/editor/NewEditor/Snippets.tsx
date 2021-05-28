import { Accordion } from '../../components/Accordion';
import React from 'react';
import { useEditorSelect } from '../../stores/editor-store';
import { key } from '../../utils/keyCode';
import { makeId } from '../../utils/make-id';

import './Snippets.scss';

const LinkSelector = () => {
  const [link, setLink, editorValue] = useEditorSelect('link', 'setLink', 'editorValue');

  const onBlurLinkInput = (e) => {
    const { value } = e.target;
    const linkId = !value || value.includes('~') ? value : makeId(value, 'default', 'react');
    setLink(linkId);
    e.target.value = linkId;
  };

  return (
    <label className="solarea-snippets-input">
      <input
        className="solarea-snippets-input__field"
        placeholder="link"
        onBlur={onBlurLinkInput}
        onKeyUp={(e) => {
          if (key.isEnter(e)) {
            onBlurLinkInput(e);
            e.stopPropagation();
          }
        }}
        style={{ width: '100%', height: 38 }}
        name="link"
        type="text"
        id="link"
        defaultValue={link}
        disabled={!!editorValue}
      />
      <span className="solarea-snippets-input__label">view id</span>
    </label>
  );
};

const availableContexts = ['', 'cell', 'transaction', 'list', 'card', 'thumbnail'].map((c) =>
  c ? `react ${c}` : c,
);

const ContextSelector = () => {
  const [selectedContext, setSelectedContext] = useEditorSelect(
    'selectedContext',
    'setSelectedContext',
  );
  return (
    <select
      style={{ width: '90%', height: 38 }}
      onChange={(e) => setSelectedContext(e.target.value)}
      value={selectedContext}
      placeholder="context"
    >
      {availableContexts.map((context) => (
        <option selected={selectedContext === context} value={context}>
          {context}
        </option>
      ))}
    </select>
  );
};
const CurrentAddressSelector = () => {
  const [currentAddress, setCurrentAddress] = useEditorSelect(
    'currentAddress',
    'setCurrentAddress',
  );

  const onBlurCurrentAddressSelector = (e) => {
    setCurrentAddress(e.target.value);
  };

  return (
    <div>
      <label className="solarea-snippets-input">
        <input
          className="solarea-snippets-input__field"
          value={currentAddress}
          onBlur={onBlurCurrentAddressSelector}
          onKeyUp={(e) => {
            if (key.isEnter(e)) {
              onBlurCurrentAddressSelector(e);
              e.stopPropagation();
            }
          }}
          style={{ width: '100%', height: 38, fontSize: 11 }}
          name="currentAddress"
          type="text"
          id="currentAddress"
          placeholder="current address"
        />
        <span className="solarea-snippets-input__label">view id</span>
      </label>
    </div>
  );
};

export const Snippets = () => {
  return (
    <div className="snippets-markup">
      <Accordion title="linking">
        <LinkSelector />
      </Accordion>
      <Accordion title="settings">
        <ContextSelector />
        <CurrentAddressSelector />
      </Accordion>
    </div>
  );
};
