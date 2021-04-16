import Wallet from '@project-serum/sol-wallet-adapter';
import {toast} from "../../utils/toast";
import {WALLETS_ERROR_TOAST_COLOR} from "../../theme/colors";

export function SolletExtensionAdapter(_, network) {
  const sollet = (window as any).sollet;
  if (sollet) {
    return new Wallet(sollet, network);
  }

  return {
    on: () => {},
    connect: () => {
      toast(
          'Sollet Extension Error',
          5000,
          WALLETS_ERROR_TOAST_COLOR
      )
    }
  }
}