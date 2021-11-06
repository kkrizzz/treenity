import SolanaWeb3, { PublicKey, Connection } from '@solana/web3.js';
import pancakeABI from './pancake-router-abi.json';
const AbiDecoder = require('abi-decoder');

const TRANSACTION = {
  jsonrpc: '2.0',
  result: {
    blockTime: 1635936807,
    meta: {
      err: null,
      fee: 5000,
      innerInstructions: [],
      logMessages: [
        'EvmTransaction: Executing transaction: gas_limit:43926961, gas_price:5000000000, value:0, action:Call(0x3d1c58b6d4501e34df37cf0f664a58059a188f00),',
        'Execution result:',
        '\n->Used gas: 115294',
        '\n->Output data: 0000000000000000000000000000000000000000000000000000000000000020000000000000000000000000000000000000000000000000000000000000000200000000000000000000000000000000000000000000001639e49bba1628000000000000000000000000000000000000000000000000006541b11432b96b9dd4',
        '\n->Status: Succeed(Returned)',
        '\n->Logs:',
        '\n-0>Address: 0xabf26902fd7b624e0db40d31171ea9dddf078351',
        '\n-0>Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 57, 228, 155, 186, 22, 40, 0, 0]',
        '\n-0>Topics:',
        '\n--0>0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '\n--1>0x0000000000000000000000000aecb1cb2b9eb0e3671e680ad18b875cbab9c469',
        '\n--2>0x00000000000000000000000033f879690c165cc320b0ba04ceb1f9ceac80f376',
        '\n',
        '\n-1>Address: 0xabf26902fd7b624e0db40d31171ea9dddf078351',
        '\n-1>Data: [255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 255, 79, 157, 225, 212, 120, 68, 58, 65, 90]',
        '\n-1>Topics:',
        '\n--0>0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925',
        '\n--1>0x0000000000000000000000000aecb1cb2b9eb0e3671e680ad18b875cbab9c469',
        '\n--2>0x0000000000000000000000003d1c58b6d4501e34df37cf0f664a58059a188f00',
        '\n',
        '\n-2>Address: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126',
        '\n-2>Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212]',
        '\n-2>Topics:',
        '\n--0>0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
        '\n--1>0x00000000000000000000000033f879690c165cc320b0ba04ceb1f9ceac80f376',
        '\n--2>0x0000000000000000000000003d1c58b6d4501e34df37cf0f664a58059a188f00',
        '\n',
        '\n-3>Address: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376',
        '\n-3>Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 42, 160, 147, 59, 88, 157, 79, 118, 41, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 82, 204, 147, 230, 29, 209, 38, 169, 190, 22]',
        '\n-3>Topics:',
        '\n--0>0x1c411e9a96e071241c2f21f7726b17ae89e3cab4c78be50e062b03a9fffbbad1',
        '\n',
        '\n-4>Address: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376',
        '\n-4>Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 57, 228, 155, 186, 22, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212]',
        '\n-4>Topics:',
        '\n--0>0xd78ad95fa46c994b6551d0da85fc275fe613ce37657fb8d5e3d130840159d822',
        '\n--1>0x0000000000000000000000003d1c58b6d4501e34df37cf0f664a58059a188f00',
        '\n--2>0x0000000000000000000000003d1c58b6d4501e34df37cf0f664a58059a188f00',
        '\n',
        '\n-5>Address: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126',
        '\n-5>Data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212]',
        '\n-5>Topics:',
        '\n--0>0x7fcf532c15f0a6db0bd6d0e038bea71d30d808c7d98cb3bf7268a95bf5081b65',
        '\n--1>0x0000000000000000000000003d1c58b6d4501e34df37cf0f664a58059a188f00',
        '\n',
        '\n->Traces:',
        '\n-0>Action: Call { code: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, context: Context { address: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, caller: 0x0aecb1cb2b9eb0e3671e680ad18b875cbab9c469, apparent_value: 0 }, gas: 299976928, input: [24, 203, 175, 229, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 57, 228, 155, 186, 22, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 225, 14, 8, 152, 21, 193, 39, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 236, 177, 203, 43, 158, 176, 227, 103, 30, 104, 10, 209, 139, 135, 92, 186, 185, 196, 105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 130, 110, 204, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 242, 105, 2, 253, 123, 98, 78, 13, 180, 13, 49, 23, 30, 169, 221, 223, 7, 131, 81, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 121, 209, 243, 207, 134, 116, 158, 5, 205, 6, 247, 173, 225, 120, 86, 194, 206, 49, 38], call_type: None }',
        '\n-0>Result: Res { gas_used: 130622, contract: None, output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 32, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 57, 228, 155, 186, 22, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212], reason: Succeed(Returned) }',
        '\n-0>Subtraces: 9',
        '\n-0>TraceAddress: []',
        '\n-1>Action: Call { code: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, context: Context { address: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, caller: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, apparent_value: 0 }, gas: 43922502, input: [9, 2, 241, 172], call_type: Some(StaticCall) }',
        '\n-1>Result: Res { gas_used: 1217, contract: None, output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 42, 138, 89, 86, 188, 227, 57, 78, 41, 121, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 83, 49, 213, 151, 50, 3, 224, 21, 91, 234, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 130, 106, 30], reason: Succeed(Returned) }',
        '\n-1>Subtraces: 0',
        '\n-1>TraceAddress: [0]',
        '\n-2>Action: Call { code: 0xabf26902fd7b624e0db40d31171ea9dddf078351, context: Context { address: 0xabf26902fd7b624e0db40d31171ea9dddf078351, caller: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, apparent_value: 0 }, gas: 43917701, input: [35, 184, 114, 221, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 236, 177, 203, 43, 158, 176, 227, 103, 30, 104, 10, 209, 139, 135, 92, 186, 185, 196, 105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 248, 121, 105, 12, 22, 92, 195, 32, 176, 186, 4, 206, 177, 249, 206, 172, 128, 243, 118, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 57, 228, 155, 186, 22, 40, 0, 0], call_type: Some(Call) }',
        '\n-2>Result: Res { gas_used: 23274, contract: None, output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], reason: Succeed(Returned) }',
        '\n-2>Subtraces: 0',
        '\n-2>TraceAddress: [1]',
        '\n-3>Action: Call { code: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, context: Context { address: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, caller: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, apparent_value: 0 }, gas: 43890801, input: [2, 44, 13, 159, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 28, 88, 182, 212, 80, 30, 52, 223, 55, 207, 15, 102, 74, 88, 5, 154, 24, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], call_type: Some(Call) }',
        '\n-3>Result: Res { gas_used: 72459, contract: None, output: [], reason: Succeed(Stopped) }',
        '\n-3>Subtraces: 3',
        '\n-3>TraceAddress: [2]',
        '\n-4>Action: Call { code: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126, context: Context { address: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126, caller: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, apparent_value: 0 }, gas: 43194493, input: [169, 5, 156, 187, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 61, 28, 88, 182, 212, 80, 30, 52, 223, 55, 207, 15, 102, 74, 88, 5, 154, 24, 143, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212], call_type: Some(Call) }',
        '\n-4>Result: Res { gas_used: 30364, contract: None, output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1], reason: Succeed(Returned) }',
        '\n-4>Subtraces: 0',
        '\n-4>TraceAddress: [2, 0]',
        '\n-5>Action: Call { code: 0xabf26902fd7b624e0db40d31171ea9dddf078351, context: Context { address: 0xabf26902fd7b624e0db40d31171ea9dddf078351, caller: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, apparent_value: 0 }, gas: 43162300, input: [112, 160, 130, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 248, 121, 105, 12, 22, 92, 195, 32, 176, 186, 4, 206, 177, 249, 206, 172, 128, 243, 118], call_type: Some(StaticCall) }',
        '\n-5>Result: Res { gas_used: 1359, contract: None, output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 42, 160, 147, 59, 88, 157, 79, 118, 41, 121], reason: Succeed(Returned) }',
        '\n-5>Subtraces: 0',
        '\n-5>TraceAddress: [2, 1]',
        '\n-6>Action: Call { code: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126, context: Context { address: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126, caller: 0x33f879690c165cc320b0ba04ceb1f9ceac80f376, apparent_value: 0 }, gas: 43159311, input: [112, 160, 130, 49, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 51, 248, 121, 105, 12, 22, 92, 195, 32, 176, 186, 4, 206, 177, 249, 206, 172, 128, 243, 118], call_type: Some(StaticCall) }',
        '\n-6>Result: Res { gas_used: 1274, contract: None, output: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 5, 82, 204, 147, 230, 29, 209, 38, 169, 190, 22], reason: Succeed(Returned) }',
        '\n-6>Subtraces: 0',
        '\n-6>TraceAddress: [2, 2]',
        '\n-7>Action: Call { code: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126, context: Context { address: 0xc579d1f3cf86749e05cd06f7ade17856c2ce3126, caller: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, apparent_value: 0 }, gas: 43816615, input: [46, 26, 125, 77, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 101, 65, 177, 20, 50, 185, 107, 157, 212], call_type: Some(Call) }',
        '\n-7>Result: Res { gas_used: 12040, contract: None, output: [], reason: Succeed(Stopped) }',
        '\n-7>Subtraces: 1',
        '\n-7>TraceAddress: [3]',
        'Log truncated',
        '\n-8>Subtraces: 0',
        '\n-8>TraceAddress: [3, 0]',
        '\n-9>Subtraces: 0',
        '\n',
      ],
      postBalances: [174278434080, 296095391430921849, 1],
      postTokenBalances: [],
      preBalances: [174277862610, 296095391431498319, 1],
      preTokenBalances: [],
      rewards: [],
      status: {
        Ok: null,
      },
    },
    slot: 36572603,
    transaction: {
      message: {
        accountKeys: [
          '4BiRh6PDP1h9vksCtJrKVyMPCaJutWWJgqaVeYjBVx1m',
          'EvmState11111111111111111111111111111111111',
          'EVM1111111111111111111111111111111111111111',
        ],
        header: {
          numReadonlySignedAccounts: 0,
          numReadonlyUnsignedAccounts: 1,
          numRequiredSignatures: 1,
        },
        instructions: [
          {
            accounts: [1, 0, 0],
            data:
              '11114tL7XZdo7rh3T3exuMBaSfaxugL9MMEBmqK7e55Ma49gmM4r15Lt12qMScfp4xxUmfQ7RKNyjCxHocvrSBbLQYh8fTxmtVrLReubowQzZbMfk61vBoMpc9yXZK3UoVLWJ9YDEtUbo5inzqaXZTecyRSPXPnqeiq1QmY5q2a2MDpdnLY9Mnh6bUaWouNomax8odFteJ7BTSJAgVFuL5ScxYdyaGT9HEds4z8aBsNfeV99v3FBuC6e7KStez7XAqE5Vb4j4UhrA28WhYDypRJRpXFNhgr6SbW5dPhNG68m1tRWXyZ2zfKwAsuZxw5MjvnuGk9P47EgNnNg3vCUExqfGqGuaNkNQXgba1hRRVuP3mjkTtC4ThkfdqRgr4V9swEcWz67swjh9agr3EvfvX3qsueh3pQsDqYke4L4eibnJSRhjHn64RCSafHX7u1eAjdfnZqKHhU64pV6bXfCT72ig5bnUu1fnyCJA9Ri4JAuuTdcUHpCk11UMagT4mgLHBugh6nN6FRTxswXxY575VZ2L4mELaDo97vX4i6sw4SYv87tcgmwvAZYBtGMs6htPrmv1oubNwTGFkyNx5U4DgwV523rREjU3dQukd11ySPWBn9KSginbQRZKk5hyfGV5eUpgbghp5DKnVGMra3PDYW9btjWZktot5URh9XedjAnGMU4D1oZ78crpnh4i4b7hsZfu2fafVGi66jRmY6nW9NTmG1WpjdE5',
            programIdIndex: 2,
          },
        ],
        recentBlockhash: '9Eyqao4s5dKy6FJLqLaJCYb8Q8kpRB7uyz5cFRdEGX6N',
      },
      signatures: [
        '4f1NULEpbtkjbmSSA2aJZ976N94FfDc2GDR2LzcZ9AWL2UbhkNV9wV2JjXmYRWj5kcz92sCm2knpuGFfLMqoRgVN',
      ],
    },
  },
  id: 1,
};

const ROUTER_ADDRESS = '0x3d1c58b6d4501e34df37cf0f664a58059a188f00';
const CHECK_ROUTER_ADDRESS = `action:Call(${ROUTER_ADDRESS}),`;

function parseLogs(logs, obj) {
  // if (!logs[0]?.endsWith(CHECK_ROUTER_ADDRESS)) return undefined;
  const first = logs[0];
  if (!first) return obj;
  const colon = first.indexOf(':');
  if (colon < 0) {
    // it is element of array
  }
  const field = first.slice(0, colon).trim();
  const rest = first.slice(colon + 1).trim();
  field;
  rest;

  if (rest.length) {
    let value;
    if (rest.startsWith('[')) {
      let arrStr = '';
      let end = rest;
      let endIdx;
      while ((endIdx = end.indexOf(']')) < 0) {
        logs.shift();
        arrStr += end;
        end = logs[0];
      }
      arrStr += end.slice(0, endIdx + 1);
      logs[0] = end.slice(endIdx + 1);
      value = JSON.parse(arrStr);
    } else {
      let end = rest.indexOf(',');
      if (end < 0) end = rest.length;
      value = rest.slice(0, end);
      logs[0] = rest.slice(end + 1);
    }
    if (!logs[0].length) logs.shift();
    if (value.indexOf(':') >= 0) {
      obj[field] = {};
    } else {
      obj[field] = value;
    }
    return parseLogs(logs, obj);
  } else {
    const val = (obj[field] = {});
    logs.shift();
    parseLogs(logs, val);
    return obj;
  }
}

function parseLogs2(line) {
  let call = line;
  if (!call) return undefined;

  //         '\n-0>Action: Call { code: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, context: Context { address: 0x3d1c58b6d4501e34df37cf0f664a58059a188f00, caller: 0x0aecb1cb2b9eb0e3671e680ad18b875cbab9c469, apparent_value: 0 }, gas: 299976928, input: [24, 203, 175, 229, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 22, 57, 228, 155, 186, 22, 40, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 100, 225, 14, 8, 152, 21, 193, 39, 45, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 160, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 236, 177, 203, 43, 158, 176, 227, 103, 30, 104, 10, 209, 139, 135, 92, 186, 185, 196, 105, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 97, 130, 110, 204, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 171, 242, 105, 2, 253, 123, 98, 78, 13, 180, 13, 49, 23, 30, 169, 221, 223, 7, 131, 81, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 197, 121, 209, 243, 207, 134, 116, 158, 5, 205, 6, 247, 173, 225, 120, 86, 194, 206, 49, 38], call_type: None }',
  call = call.slice(call.indexOf(':') + 1);
  call = call.replace(/(0x\w+)/g, '"$1"');
  call = call.replace(/\w+ {/g, '{');
  call = call.replace(/None/g, 'null');
  call = call.replace(/(\w+):/g, '"$1":');
  call = call.replace(/(\w+\(\w+\))/g, '"$1"');

  return JSON.parse(call);
}

function parse() {
  try {
    AbiDecoder.addABI(pancakeABI);
    const logs = TRANSACTION.result.meta.logMessages;
    const index = logs.findIndex((l) =>
      l.startsWith(`\n-0>Action: Call { code: ${ROUTER_ADDRESS}`),
    );
    const value = parseLogs2(logs[index]);
    const result = parseLogs2(logs[index + 1]);
    console.log(value, result);
    const bytes = Buffer.from(new Uint8Array(value.input));
    console.log(bytes);
    const method = AbiDecoder.decodeMethod('0x' + bytes.toString('hex'));
    const output = Buffer.from(new Uint8Array(result.output)).toString('hex');
    const results = AbiDecoder.decodeMethod('0x' + output);
    console.log(method);
  } catch (er) {
    console.error(er);
  }
}

export default async function subscribeEvmLogs() {
  parse();
  // const ws = new Ws('ws://mainnet.velas.com/rpc');
  // ws.on('open', () => {
  //   console.log('ws');
  // })
  try {
    const web3 = new Connection('https://api.mainnet.velas.com/ws');
    await web3.onLogs(new PublicKey('EVM1111111111111111111111111111111111111111'), (tx) => {
      console.log('EVM111', tx);
    });
  } catch (e) {
    console.error(e);
  }
}
