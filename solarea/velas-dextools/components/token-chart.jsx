exports.props = [
  {
    id: 'base',
    name: 'base',
    type: 'select',
    options: [
      {
        value: '0xaBf26902Fd7B624e0db40D31171eA9ddDf078351',
        label: 'WAG',
      },
      {
        value: '0xc579d1f3cf86749e05cd06f7ade17856c2ce3126',
        label: 'wVLX',
      },
      {
        value: '0xe2c120f188ebd5389f71cf4d9c16d05b62a58993',
        label: 'USDC',
      },
    ],
  },
  {
    id: 'quote',
    name: 'quote',
    type: 'select',
    options: [
      {
        value: '0xe2c120f188ebd5389f71cf4d9c16d05b62a58993',
        label: 'USDC',
      },
      {
        value: '0xaBf26902Fd7B624e0db40D31171eA9ddDf078351',
        label: 'WAG',
      },
      {
        value: '0xc579D1f3CF86749E05CD06f7ADe17856c2CE3126',
        label: 'wVLX',
      },
    ],
  },
];

exports.name = 'Token chart';
exports.description = 'Shows multiple token charts';
