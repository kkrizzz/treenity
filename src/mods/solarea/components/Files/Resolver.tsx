import React, { CSSProperties, useMemo } from 'react';
import { ImageView } from './ImageView';
import { applicationResolvers } from './applicationResolvers';
import { AudioView } from './AudioView';
import { textResolvers } from './textResolvers';

export const resolveViewByMime = ({
  mimetype,
  data,
  style,
}: {
  mimetype: string;
  data: Buffer;
  style?: CSSProperties;
}) => {
  const [mime, format] = mimetype.split('/');

  switch (mime) {
    case 'image':
      return <ImageView mime={mimetype} data={data} />;
    case 'application':
      return applicationResolvers[format]({ mimetype, data });
    case 'audio':
      return <AudioView />;
    case 'text':
      return textResolvers[format]({ mimetype, data });
    default:
      return <div>File resolver not found</div>;
  }
};
