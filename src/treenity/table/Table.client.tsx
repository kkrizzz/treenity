import React from 'react';
import { addComponent } from '../context/context-db';
import { IAnyType, types } from 'mobx-state-tree';
import { Meta, meta } from '../meta/meta.model';
import { ArrayInPort, ArrayOutPort } from '../ports/ports';
import { Table } from 'antd';


export const TableMeta = meta('table.table', types.model({
  input: types.optional(types.array(Meta), () => []),
}));
export const FilterMeta = meta('table.filter', types.model({
  input: types.optional(types.array(Meta), () => []),
  output: types.optional(types.array(Meta), () => []),
}));

addComponent(TableMeta, 'react', {
  ports: {
    input: new ArrayInPort(),
  },
}, ({ value, ports }) => {
  const data = ports.input;

  return <Table
    dataSource={data}
  />;
});

addComponent(FilterMeta, 'react', {
  ports: {
    input: new ArrayInPort(),
    output: new ArrayOutPort(),
  },
});
