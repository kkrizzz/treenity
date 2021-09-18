exports.props = [
  {
    id: 'contract',
    name: 'contract',
    type: 'select',
    options: [
      {
        value: 'token.skyward.near',
        text: 'SKYWARD',
      },
      {
        value: 'token.v2.ref-finance.near',
        text: 'REF-FINANCE',
      },
    ],
  },
];

exports.name = 'Token price';

exports.description = 'Shows price of chosen token';
