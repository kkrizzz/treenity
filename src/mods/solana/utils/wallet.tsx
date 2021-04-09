import React, {
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
} from 'react';
import {
    WalletAdapter,
    LedgerWalletAdapter,
    SolongWalletAdapter,
    PhantomWalletAdapter,
    SolletExtensionAdapter,
    MathWalletAdapter,
} from '../wallet-adapters';
import './wallet.css'
import {toast} from "./toast";
import { WALLETS_ERROR_TOAST_COLOR } from "../theme/colors";
import {Modal} from "../components/Modal";
import {req} from "./req";
import {AUTH_SERVICE_URL} from "../config";
import {useSessionStorageState} from "../hooks/useSessionStorageState";
import {Transaction} from "@solana/web3.js";
import {transaction} from "mobx";

const ASSET_URL =
    'https://cdn.jsdelivr.net/gh/solana-labs/oyster@main/assets/wallets';

export const WALLET_PROVIDERS = [
    {
        name: 'Sollet Extension',
        url: 'https://www.sollet.io/extension',
        icon: `${ASSET_URL}/sollet.svg`,
        adapter: SolletExtensionAdapter as any,
    },
    {
        name: 'Ledger',
        url: 'https://www.ledger.com',
        icon: `${ASSET_URL}/ledger.svg`,
        adapter: LedgerWalletAdapter,
    },
    {
        name: 'Solong',
        url: 'https://www.solong.com',
        icon: `${ASSET_URL}/solong.png`,
        adapter: SolongWalletAdapter,
    },
    {
        name: 'Phantom',
        url: 'https://www.phantom.app',
        icon: `https://www.phantom.app/img/logo.png`,
        adapter: PhantomWalletAdapter,
    },
    {
        name: 'MathWallet',
        url: 'https://www.mathwallet.org',
        icon: `${ASSET_URL}/mathwallet.svg`,
        adapter: MathWalletAdapter,
    }
];

const WalletContext = React.createContext<{transaction: Transaction | undefined, session: string, wallet: any, connected: boolean, select: any, close: any }| null>(null);

export function WalletProvider({ children }) {
    const [connected, setConnected] = useState(false);
    const [wallet, setWallet] = useState<WalletAdapter | undefined>(undefined);
    const [session, setSession] = useSessionStorageState('sessionid')
    const [transaction, setTransaction] = useState<Transaction>()

    useEffect(() => {
        if (wallet) {
            wallet.on('connect', () => {
                if (wallet?.publicKey) {
                    req.post(AUTH_SERVICE_URL, {pubkey: wallet.publicKey.toBase58()}).then(res => {
                        res.text().then((sid) => {
                            setConnected(true);
                            setSession(sid);
                            toast(
                                'Connected',
                                5000,
                                WALLETS_ERROR_TOAST_COLOR
                            )
                        })
                    })
                }
            });

            wallet.on('disconnect', () => {
                setSession(undefined)
                setConnected(false);
                setWallet(undefined)
                toast(
                    'Disconnected',
                    5000,
                    WALLETS_ERROR_TOAST_COLOR
                )
            });
            wallet.on('signTransaction', (tx: Transaction) => {
                setTransaction(tx);
            });
            wallet.on('newTransaction', (tx: Transaction) => {
                setTransaction(undefined);
            });
        }

        return () => {
            setConnected(false);
            if (wallet && wallet.connected) {
                wallet.disconnect();
                setConnected(false);
            }
        };
    }, [wallet]);

    const [isModalVisible, setIsModalVisible] = useState(false);

    const select = useCallback(() => setIsModalVisible(true), []);
    const close = useCallback(() => setIsModalVisible(false), []);

    return (
        <WalletContext.Provider
            value={{
                transaction,
                wallet,
                connected,
                select,
                close,
                session
            }}
        >
            {children}
            <Modal
                closeBtnColor={"white"}
                modalBackground={"#2d2d2d"}
                width={400}
                transparent={false}
                onBackdropPress={close}
                isVisible={isModalVisible}
            >
                {WALLET_PROVIDERS.map((provider) => {
                    const onClick = () => {
                        const adapterWalley = new provider.adapter();
                        adapterWalley.connect();
                        setWallet(adapterWalley)
                    }
                    return (
                        <div className="wallet-select_item" onClick={onClick}>
                            <img style={{background: 'rgba(255,255,255,0)'}} width={50} height={50} src={provider.icon}/>
                            <div className="wallet-select_item-title">{provider.name}</div>
                        </div>
                    )
                })}
            </Modal>
        </WalletContext.Provider>
    );
}

export function useWallet() {
    const context = useContext(WalletContext);
    if (!context) {
        throw new Error('Missing wallet context');
    }

    const wallet = context.wallet;
    return {
        session: context.session,
        select: context.select,
        close: context.close,
        transaction: context.transaction,
        connected: context.connected,
        wallet: wallet,
        connect() {
            wallet ? wallet.connect() : context.select();
        },
        disconnect() {
            wallet?.disconnect();
        },
    };
}
