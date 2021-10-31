const argsToObj = (arr) =>
  arr.reduce((o, ar) => {
    const { argument, value } = ar;
    const cur = o[argument];
    if (cur) {
      if (Array.isArray(cur)) {
        cur.push(value);
      } else {
        o[argument] = [cur, value];
      }
    } else o[argument] = value;

    return o;
  }, {});

const TxCallData = ({ tx }) => {
  const [txCall, loading] = useBitQuery(getCallInfo, { hash: tx.hash });

  if (loading) return 'loading...';

  const {
    smartContractCalls: callsRaw,
    smartContractEvents: eventsRaw,
    transfers,
  } = txCall.data.ethereum;
  const calls = callsRaw.map((call) => {
    const { smartContract: c } = call;
    return {
      method: call.smartContractMethod.name,
      contract: {
        address: c.address.address,
        type: c.contractType,
        symbol: c.currency && c.currency.symbol,
      },
      args: argsToObj(call.arguments),
      time: new Date(call.block.timestamp.unixtime * 1000),
      height: call.block.height,
    };
  });

  const events = eventsRaw.map((event) => {
    // const { smartContract: c } = event;
    return {
      event: event.smartContractEvent.name,
      // contract: {
      //   address: c.address.address,
      //   type: c.contractType,
      //   symbol: c.currency && c.currency.symbol,
      // },
      args: argsToObj(event.arguments),
      // time: new Date(event.block.timestamp.unixtime * 1000),
      // height: event.block.height,
    };
  });

  const mainCall = calls.find((c) => c.contract.address === tx.to);

  if (mainCall.method.startsWith('swap')) {
    const path = mainCall.args.path;
    const coins = path.map((p) => transfers.find((t) => t.currency.address === p));
    return (
      <div>
        Swapping {coins[0].amount} {coins[0].currency.symbol} to {coins[1].amount}{' '}
        {coins[1].currency.symbol}
      </div>
    );
  }

  return null;

  return (
    <div>
      <div>Call to {mainCall.name}</div>
      {calls.map((call) => (
        <div>
          <div>
            {call.method} - {call.contract.address}
          </div>
          <pre>{JSON.stringify(call.args, null, 2)}</pre>
        </div>
      ))}
    </div>
  );
};

const getCallInfo = `
  query($hash: String) {
    ethereum(network: velas) {
      smartContractCalls(txHash: { is: $hash }) {
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
      smartContractEvents(txHash: { is: $hash }) {
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
      transfers(txHash: { is: $hash }) {
        amount
        currency {
          address
          name
          symbol
          decimals
        }
        receiver {
          address
        }
        sender {
          address
        }
      }
    }
  }
`;

add(TxCallData);
