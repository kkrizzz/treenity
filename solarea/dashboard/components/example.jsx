exports.props = [
  {
    id: 'content',
    name: 'content',
    type: 'string',
  },
  {
    id: 'someProp',
    name: 'someProp',
    type: 'select',
    options: [
      {
        value: 'kek',
        text: 'KEK',
      },
      {
        value: 'lol',
        text: 'LOL',
      },
    ],
  },
];

exports.name = 'Example component';
exports.description = 'Just example component';
