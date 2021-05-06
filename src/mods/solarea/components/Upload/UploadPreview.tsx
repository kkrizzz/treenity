import React, { CSSProperties } from 'react';
import { calcRentFee } from '../../utils/calcRentFee';

interface IUploadPreviewResolver {
  mime: string;
  binary: string;
  style?: CSSProperties;
}

export const UploadPreviewResolvers = {
  Image: ({ mime, binary, style }: IUploadPreviewResolver) => {
    console.log(mime);
    return (
      <img
        alt=""
        style={style}
        src={`data:${mime};base64, ${new Buffer(binary, 'binary').toString('base64')}`}
      />
    );
  },
  Application: ({ mime, binary, style }: IUploadPreviewResolver) => {
    return (
      <div>
        {mime == 'application/json' && <div>{new Buffer(binary, 'binary').toString('utf-8')}</div>}
      </div>
    );
  },
  Audio: ({ mime, binary, style }: IUploadPreviewResolver) => {
    return (
      <div>
        <div></div>
      </div>
    );
  },
};

export const UploadPreview = (props: { src: File; binary: string }) => {
  const { src, binary } = props;
  const { size, type } = src;
  return (
    <div>
      {binary && src && (
        <>
          <div
            style={{
              padding: 8,
              maxHeight: 400,
            }}
          >
            {type.startsWith('image') && (
              <UploadPreviewResolvers.Image binary={binary} mime={type} />
            )}
            {type.startsWith('audio') && (
              <UploadPreviewResolvers.Audio binary={binary} mime={type} />
            )}
            {type.startsWith('application') && (
              <UploadPreviewResolvers.Application binary={binary} mime={type} />
            )}
          </div>
          <div>File size: {(size / 1024).toFixed(8)} KB</div>
          <div>Store price: {calcRentFee(size).toFixed(8)} SOL</div>
          <div>Solana fee: {(Math.ceil(size / 1024) * 0.000005).toFixed(8)} SOL</div>
        </>
      )}
    </div>
  );
};
