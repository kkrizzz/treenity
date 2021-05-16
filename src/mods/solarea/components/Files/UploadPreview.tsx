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

  const Resolver = useMemo(
    () => resolveViewByMime({ mimetype: src.type, data: new Buffer(binary, 'binary') }),
    [src, binary],
  );

  if (!Resolver) {
    return <div>sorry. file resolver not found :(</div>;
  }

  return (
    <div style={{ padding: 8 }}>
      {binary && src && (
        <>
          <div
            style={{
              maxHeight: 400,
              overflow: 'auto',
            }}
          >
            {Resolver}
          </div>
          <div>File size: {size} bytes</div>
          <div>Store price: {calcRentFee(size).toFixed(6)} SOL</div>
          <div>Solana fee: {(Math.ceil(size / 1024) * 0.000005).toFixed(6)} SOL</div>
        </>
      )}
    </div>
  );
};
