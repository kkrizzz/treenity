exports.props = [
  {
    id: 'contract',
    name: 'Token',
    type: 'select',
    options: [
      {
        value: 'token.skyward.near',
        label: 'SKYWARD',
      },
      {
        value: 'token.v2.ref-finance.near',
        label: 'REF-FINANCE',
      },
    ],
  },
];

exports.name = 'Token price';

exports.description = 'Shows price of chosen token';
