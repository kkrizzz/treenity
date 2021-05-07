import React from 'react';
import { IResolverView } from './UploadPreview';

export const JsonView = ({ mime, data, style }: IResolverView) => {
  return <div style={style}>{data.toString('utf-8')}</div>;
};
