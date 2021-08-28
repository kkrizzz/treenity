import { useEffect, useState } from 'react';
import { PublicKey } from '@solana/web3.js';
import { useConnection } from './useConnection';
import { Buffer } from 'buffer';

const urlRegExp = new RegExp(
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/gi,
);

const metaplexProgramId = new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s');

export const useMetaplexNFT = (entityId) => {
  const [isLoading, setIsLoading] = useState(true);
  const [nftData, setNftData] = useState(null);
  const connection = useConnection();

  useEffect(() => {
    (async function () {
      const associatedMetaDataAccount = (
        await PublicKey.findProgramAddress(
          [
            Buffer.from('metadata'),
            metaplexProgramId.toBuffer(),
            new PublicKey(entityId).toBuffer(),
          ],
          metaplexProgramId,
        )
      )[0];
      const { data } = await connection.getAccountInfo(associatedMetaDataAccount);
      const utf8 = data.toString('utf-8');
      const [metadataUrl] = urlRegExp.exec(utf8);
      const arweaveStoredMetadata = await (await globalThis.fetch(metadataUrl)).json();
      setNftData(arweaveStoredMetadata);
      setIsLoading(false);
      console.log(arweaveStoredMetadata);
    })();
  }, [entityId]);

  return [nftData, isLoading];
};
