import React, { CSSProperties, useMemo } from 'react';
import { calcRentFee } from '../../utils/calcRentFee';
import { ImageView } from './ImageView';
import { resolveViewByMime } from './Resolver';

export interface IResolverView {
  mime: string;
  data: Buffer;
  style?: CSSProperties;
}

export const UploadPreview = (props: { src: File; binary: string }) => {
  const { src, binary } = props;
  const { size } = src;

  return (
    <div>
      {binary && src && (
        <>
          <div
            style={{
              padding: 8,
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            {resolveViewByMime({ mimetype: src.type, data: new Buffer(binary, 'binary') })}
          </div>
          <div>File size: {size} bytes</div>
          <div>Store price: {calcRentFee(size).toFixed(6)} SOL</div>
          <div>Solana fee: {(Math.ceil(size / 1024) * 0.000005).toFixed(6)} SOL</div>
        </>
      )}
    </div>
  );
};
