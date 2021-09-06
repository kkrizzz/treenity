const { lpsRound } = await require('solarea://explorer/utils');
const NamedHash = render('dev', 'named-hash');
const TwoColumn = render('dev', 'two-column');

add(({ id, instruction }) => {
  const parsed = instruction.parsed.info;
  console.log(parsed);
  switch (instruction.parsed.type) {
    case 'transfer':
      return (
        <div>
          <div class="bu-columns bu-is-mobile">
            <div className="bu-column bu-is-4">From</div>
            <div className="bu-column bu-is-4">Amount</div>
            <div className="bu-column bu-is-4">To</div>
          </div>
          <div class="bu-columns bu-is-mobile">
            <div className="bu-column bu-is-4">
              <NamedHash hash={parsed.source} type="address" />
            </div>
            <div className="bu-column bu-is-4">{lpsRound(parsed.lamports)}</div>
            <div className="bu-column bu-is-4">
              <NamedHash hash={parsed.destination} type="address" />
            </div>
          </div>
        </div>
      );
    case 'assign':
      return (
        <div>
          <TwoColumn
            first="Account"
            second={<NamedHash hash={parsed.account} type="address" alignRight />}
          />
          <TwoColumn
            first="Owner"
            second={<NamedHash hash={parsed.owner} type="address" alignRight />}
          />
        </div>
      );
    case 'allocate':
      return (
        <div>
          <TwoColumn
            first="Account"
            second={<NamedHash hash={parsed.account} type="address" alignRight />}
          />
          <TwoColumn first="Space (bytes)" second={parsed.space} />
        </div>
      );
  }
  // TODO
  return <table class="bu-table"></table>;

  // <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});
