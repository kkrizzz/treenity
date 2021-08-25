const Hash = render('dev', 'hash');
const AddressName = render(null, 'name', 'react-text');

add((props) => (
  <AddressName
    id={hash}
    render={(name) => (
      <Hash {...props}>
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {name}
        </div>
      </Hash>
    )}
    fallback={() => <Hash {...props} />}
  />
));
