import { calcRentFee } from '../../utils/calcRentFee';
import React from 'react';

export const CodeUploaderWithPreview = ({ view, editorValue, uploadToSolanaStarted }) => {
  return (
    <div>
      <div>
        {view?.dataSource === 'solana' &&
          'Code with this id now stored on Solana.\n Remove transaction fee price is 0.00005 SOL'}
      </div>
      <div>File size: {editorValue.length} bytes</div>
      <div>Store price: {calcRentFee(editorValue.length).toFixed(6)} SOL</div>
      <div>
        Solana fee:{' '}
        {(
          Math.ceil(editorValue.length / 1024) * 0.000005 +
          (view?.dataSource === 'rest' ? 0 : 0.000005)
        ).toFixed(6)}{' '}
        SOL
      </div>
      <div>
        {!uploadToSolanaStarted ? (
          'Upload not started'
        ) : (
          <div>
            Uploading . . .<span className="spinner"></span>
          </div>
        )}
      </div>
    </div>
  );
};
