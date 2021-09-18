exports.props = [
  {
    id: 'content',
    name: 'content',
    type: 'string',
  },
  {
    id: 'someProp',
    name: 'someProp',
    type: 'multipleSelect',
    options: [
      {
        value: 'kek',
        label: 'KEK',
      },
      {
        value: 'lol',
        label: 'LOL',
      },
    ],
  },
];

exports.name = 'Example component';
exports.description = 'Just example component';
