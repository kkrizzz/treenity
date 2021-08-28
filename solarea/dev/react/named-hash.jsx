const Hash = render('dev', 'hash');
const AddressName = render(null, 'name', 'react-text');

add(({ type, hash, alignRight, urlParams }) => (
  <AddressName
    id={hash}
    render={(name) => (
      <Hash hash={hash} type={type} alignRight={alignRight} urlParams={urlParams}>
        <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
          {name}
        </div>
      </Hash>
    )}
    fallback={() => <Hash hash={hash} type={type} alignRight={alignRight} urlParams={urlParams} />}
  />
));
