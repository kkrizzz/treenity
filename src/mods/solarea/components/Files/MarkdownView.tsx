import React from 'react';
import Markdown from 'markdown-to-jsx';
import { IResolverView } from './UploadPreview';

export const MarkdownView = ({ data }: IResolverView) => {
  return <Markdown>{data.toString('utf-8')}</Markdown>;
};
