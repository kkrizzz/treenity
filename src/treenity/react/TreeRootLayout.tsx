import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Tree } from 'antd';
import styled from 'styled-components';
import { observer } from 'mobx-react-lite';
import { groupBy } from 'lodash';

import { Node } from '../tree/node';

import { useServiceFind } from './useServiceFind';
import { addComponent } from '../context/context-db';
import { useCurrent } from './current-node';
import { RenderMeta } from './render-meta';

import './TreeRootLayout.less';

const { Sider, Header, Content, Footer } = Layout;

const SiderHeader = styled(Header)`
  padding: 0 16px;
`;

const MainHeader = styled(Header)`
  color: white;
`;

const Logo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;
const LogoImg = styled.img`
  width: 32px;
  height: 32px;
`;
const LogoText = styled.span`
  color: white;
  font-size: 24px;
  margin-left: 8px;
`;

function collectChildren(node, groupped) {
  if (groupped[node.key]) {
    node.children = groupped[node.key].map((c) => {
        const childNode = {
          key: c._id,
          title: c.name,
          className: 'tr-tree-item',
        };
        return collectChildren(childNode, groupped);
      },
    );
  }
  node.loaded = node.children?.length > 0;
  node.isLeaf = node.children?.length === 0;
  return node;
}

function createTreeData(root, tree) {
  const groupped = groupBy(tree, (t) => t._p);
  groupped[''] = [root];
  const result = collectChildren(
    { key: '' },
    groupped,
  );
  return result?.children || [];
}

const TreeRootLayout = observer(function TreeRootLayout({ value }: any) {
  const { current, setCurrentId } = useCurrent();
  const [tree, loadSubtree] = useServiceFind('tree', { _p: value._id });
  const treeData = createTreeData(value, tree);
  const [loadedKeys, setLoadedKeys] = useState(() => [value._id]);

  return (
    <Layout>
      <Sider className="sidermenu">
        <SiderHeader>
          <Link to="/tree">
            <Logo>
              <LogoImg src="/img/logo.svg" />
              <LogoText>Treenity</LogoText>
            </Logo>
          </Link>
        </SiderHeader>
        <Tree
          selectedKeys={[current._id]}
          autoExpandParent
          // onSelect={(keys) => setCurrentId(keys[0] || value._id)}
          loadedKeys={loadedKeys}
          loadData={async (node) => {
            setLoadedKeys([...loadedKeys, node.key]);
            if (node.loaded) return;
            await loadSubtree({ _p: node.key });
          }}
          className="tr-tree"
          treeData={treeData}
          motion={null}
          showLine
        />
      </Sider>
      <Layout>
        <MainHeader>Header</MainHeader>
        <Content style={{ height: '100%' }}>
          <RenderMeta value={current} context="layout" />
        </Content>
        <Footer>
          <a href="https://treenity.pro">Treenity(c) 2021</a>
        </Footer>
      </Layout>
    </Layout>
  );
});

addComponent(Node, 'react layout root', { ns: 'system' }, TreeRootLayout);
