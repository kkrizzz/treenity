const TwoColumn = render('dev', 'two-column');
const Hash = render('dev', 'hash');
const NamedHash = render('dev', 'named-hash');
const DashboardCard = render('dev', 'dashboard-card');
const { weiToEth, lpsRound } = await require('solarea://explorer/utils');

const getCallInfo = `
query ($hash: String) {
  ethereum(network: velas) {
    smartContractCalls(txHash: {is: $hash}) {
      smartContractMethod {
        name
        signature
      }
      arguments {
        argument
        value
        argumentType
      }
      block {
        timestamp {
          unixtime
        }
        height
      }
      smartContract {
        address {
          address
          annotation
        }
        protocolType
        contractType
        currency {
          symbol
        }
      }
      caller {
        address
      }
    }
    smartContractEvents(txHash: {is: $hash}) {
      eventIndex
      smartContract {
        address {
          address
        }
      }
      smartContractEvent {
        name
        signature
      }
      arguments {
        argument
        value
        argumentType
      }
    }
  }
}
`;

const arrToObj = (arr, adder) => {
  return arr.reduce((o, el) => (adder(el, o), o), {});
};

const TxCallData = ({ tx }) => {
  const [txCall, loading] = useBitQuery(getCallInfo, { hash: tx.hash });

  if (loading) return 'loading...';

  const { smartContractCalls: callsRaw, smartContractEvents: eventsRaw } = txCall.data.ethereum;
  const calls = callsRaw.map((call) => {
    const { smartContract: c } = call;
    return {
      method: call.smartContractMethod.name,
      contract: {
        address: c.address.address,
        type: c.contractType,
        symbol: c.currency && c.currency.symbol,
      },
      args: arrToObj(call.arguments, (ar, o) => (o[ar.argument] = ar.value)),
      time: new Date(call.block.timestamp.unixtime * 1000),
      height: call.block.height,
    };
  });

  return JSON.stringify({ calls }, null, 2);
};

add(({ tx }) => {
  const gasUsed = parseInt(tx.gas, 16);
  const gasPrice = parseInt(tx.gasPrice, 16);
  const fee = weiToEth(gasUsed * gasPrice, 8);

  return (
    <>
      <div className="bu-columns">
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="From">
            <NamedHash hash={tx.from} type="address" />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Amount" value={weiToEth(tx.value)} />
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="To">
            <NamedHash hash={tx.to} type="address" />
          </DashboardCard>
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-6">
          <DashboardCard subcard size="small" title={'Hash'}>
            <Hash hash={tx.hash} type="tx" />
          </DashboardCard>
        </div>
        <div className="bu-column bu-is-6">
          <DashboardCard subcard size="small" title="Block">
            <Hash hash={parseInt(tx.blockNumber, 16)} type="block" urlParams="chain=evm" />
          </DashboardCard>
        </div>
      </div>
      <div className="bu-columns">
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Fee" value={fee} />
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Gas used" value={gasUsed} />
        </div>
        <div className="bu-column bu-is-4">
          <DashboardCard subcard size="small" title="Gas price" value={gasPrice} />
        </div>
      </div>
      {tx.input && (
        <div className="bu-columns">
          <div className="bu-column bu-is-12">
            <pre
              className="bu-notification bu-monospace log-messages"
              style={{
                background: 'var(--theme-logs-bg)',
                color: 'var(--theme-logs-color)',
                borderRadius: 'var(--theme-border-radus)',
              }}
            >
              {tx.input}
            </pre>
          </div>
        </div>
      )}
      {tx.input && (
        <div className="bu-columns">
          <div className="bu-column bu-is-12">
            <pre>
              <TxCallData tx={tx} />
            </pre>
          </div>
        </div>
      )}
    </>
  );
});
