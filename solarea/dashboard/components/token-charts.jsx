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
      {
        value: 'c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2.factory.bridge.near',
        label: 'wETH',
      },
      {
        value: 'f5cfbc74057c610c8ef151a439252680ac68c6dc.factory.bridge.near',
        label: 'OCT',
      },
      {
        value: 'berryclub.ek.near',
        label: 'BANANA',
      },
    ],
  },
];

exports.name = 'Token charts';
exports.description = 'Shows multiple token charts';
