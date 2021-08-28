const Hash = render('dev', 'hash');
const AddressName = render(null, 'name', 'react-text');

add(({ type, hash, alignRight }) => (
  <AddressName
    id={hash}
    render={(name) => (
      <Hash alignRight={alignRight} hash={hash} type={type}>
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {name}
        </div>
      </Hash>
    )}
    fallback={() => <Hash alignRight={alignRight} hash={hash} type={type} />}
  />
));
