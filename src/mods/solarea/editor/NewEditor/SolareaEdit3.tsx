import React, { useState } from 'react';

import './SolareaEdit.scss';
import { SolareaViewId } from '../../storage-adapters/SolareaViewId';
import QueriesMarket from './graphql-editor/QueriesMarket';
import { SolareaEditMenu } from './SolareaEditMenu';
import { SolariaEditThemeProvider, styled } from './SolariaEditTheme';
import ComponentEditor from './ComponentEditor';

const SolareaEdit = ({ id, name, context, ...params }) => {
  const viewId = new SolareaViewId(id, name, context);

  const [currentTab, setCurrentTab] = useState('edit');

  const tabs = {
    edit: () => <ComponentEditor viewId={viewId} params={params} />,
    graphql: () => <QueriesMarket viewId={viewId} />,
  };

  return (
    <SolariaEditThemeProvider>
      <SolareaEditContainer>
        <SolareaEditMenu
          id={id}
          name={name}
          onSelectTab={(newTab) => setCurrentTab(newTab)}
          currentTab={currentTab}
        />

        <h1>{currentTab === 'edit' ? 'Editor' : 'URLs'}</h1>
        <div className="sol-edit__content">
          {currentTab === 'edit' && <ComponentEditor viewId={viewId} params={params} />}
          {currentTab === 'graphql' && <QueriesMarket viewId={viewId} />}
        </div>
      </SolareaEditContainer>
    </SolariaEditThemeProvider>
  );
};

const SolareaEditContainer = styled.div`
  background: ${(p) => p.theme.colors.fill.primary};
  padding-left: 60px;

  h1 {
    margin: 0;
    padding: 14px 10px;
    color: ${(p) => p.theme.colors.text.primary};
    font-family: Inter;
    font-style: normal;
    font-weight: 900;
    font-size: 12px;
    line-height: 12px;
    text-transform: uppercase;
  }

  .sol-edit__content {
    padding-left: 14px;
    border-radius: 10px 0 0 0;
    background: ${(p) => p.theme.colors.fill.secondary};
    display: flex;
    align-items: stretch;
    height: calc(100vh - 40px);
  }
`;

export default SolareaEdit;
