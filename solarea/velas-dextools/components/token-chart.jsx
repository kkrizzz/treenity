exports.props = [
  {
    id: 'base',
    name: 'base',
    type: 'select',
    options: [
      {
        value: '0x40c8002c2887ade2297ad48d9dc101de08bd104c',
        label: 'WAG',
      },
      {
        value: '0x485f49e0764c305dc6fc1da2e5b786f65f8c95aa',
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
        value: '0x40c8002c2887ade2297ad48d9dc101de08bd104c',
        label: 'WAG',
      },
      {
        value: '0x485f49e0764c305dc6fc1da2e5b786f65f8c95aa',
        label: 'wVLX',
      },
    ],
  },
];

exports.name = 'Token chart';
exports.description = 'Shows multiple token charts';
