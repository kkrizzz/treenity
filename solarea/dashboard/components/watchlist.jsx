exports.props = [
  {
    id: 'contracts',
    name: 'contracts',
    type: 'multipleSelect',
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

exports.name = 'Tokens watchlist';
exports.description = 'Here you can watch multiple tokens';
