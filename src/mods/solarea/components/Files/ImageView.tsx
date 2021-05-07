import React from 'react';
import { IResolverView } from './UploadPreview';

export const ImageView = ({ mime, data, style }: IResolverView) => {
  return <img alt="" style={style} src={`data:${mime};base64, ${data.toString('base64')}`} />;
};
