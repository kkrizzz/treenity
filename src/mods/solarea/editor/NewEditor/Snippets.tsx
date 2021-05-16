import { Accordion } from '../../components/Accordion';
import React from 'react';
import useEditorStore from '../../stores/editor-store';
import { key } from '../../utils/keyCode';
import { makeId } from '../../utils/make-id';

import './Snippets.scss';

const LinkSelector = () => {
  const [link, setLink, editorValue] = useEditorStore((state) => [
    state.link,
    state.setLink,
    state.editorValue,
  ]);

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

const ContextSelector = () => {
  const [selectedContext, setSelectedContext] = useEditorStore((state) => [
    state.selectedContext,
    state.setSelectedContext,
  ]);
  const availableContexts = [
    'react',
    'react cell',
    'react transaction',
    'react list',
    'react card',
    'react thumbnail',
  ];
  return (
    <select
      style={{ width: 170, height: 38 }}
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

export const Snippets = () => {
  return (
    <div className="snippets-markup">
      <Accordion title="linking">
        <LinkSelector />
      </Accordion>
      <Accordion title="settings">
        <ContextSelector />
      </Accordion>
    </div>
  );
};
