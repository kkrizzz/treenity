import React from 'react';
import {useWallet} from "../utils/wallet";
import {AccountMeta, Transaction, TransactionInstruction} from "@solana/web3.js";

export const useTransaction: any = () => {
    const {session, wallet, connected, transaction} = useWallet();
    const [val ,update] = React.useState<any>(0);

    React.useEffect(() => {
        if (wallet && connected) {
            const keys: Array<AccountMeta> = [{isSigner: true, isWritable: false, pubkey: wallet.publicKey}]

            const txi = new TransactionInstruction({
                keys: keys,
                programId: wallet.publicKey.toBase58(),
                data: Buffer.from(session)
            });

            const tx = new Transaction({
                recentBlockhash: '5Tx8F3jgSHx21CbtjwmdaKPLM5tWmreWAnPrbqHomSJF',
                feePayer: keys[0].pubkey
            });

            tx.add(txi);
            wallet.signTransaction(tx);
        }
    }, [val])

    const newTransaction = () => {
        update(val+1)
    }

    return [transaction, newTransaction]
}