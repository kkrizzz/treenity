import { Accordion } from './components/Accordion';
import React, { FC } from 'react';
import { useEditorSelect } from '../../stores/editor-store';
import { key } from '../../utils/keyCode';
import { makeId } from '../../utils/make-id';

import './Snippets.scss';
import Input from './components/Input';
import Select from './components/Select';

const LinkSelector = () => {
  const [link, setLink, editorValue] = useEditorSelect('link', 'setLink', 'editorValue');

  const onBlurLinkInput = (e) => {
    const { value } = e.target;
    const linkId = !value || value.includes('~') ? value : makeId(value, 'default', 'react');
    setLink(linkId);
    e.target.value = linkId;
  };

  return (
    <Input
      label="View ID"
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
    <Select
      label="View ID"
      onChange={(e) => setSelectedContext(e.target.value)}
      value={selectedContext}
      defaultValue={''}
      placeholder="context"
    >
      {availableContexts.map((context) => (
        <option selected={selectedContext === context} value={context}>
          {context ? context : 'react'}
        </option>
      ))}
    </Select>
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
    <Input
      label="View ID"
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
  );
};

export const Snippets: FC = ({ children }) => {
  return (
    <div className="snippets-markup">
      <Accordion title="Linking">
        <LinkSelector />
      </Accordion>
      <Accordion title="Settings">
        <ContextSelector />
        <CurrentAddressSelector />
      </Accordion>
      {children}
    </div>
  );
};
