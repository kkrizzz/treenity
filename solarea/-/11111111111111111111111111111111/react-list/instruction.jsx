const { lpsRound } = await require('solarea://explorer/utils');
const NamedHash = render('dev', 'named-hash');

add(({ id, instruction }) => {
  const parsed = instruction.parsed.info;
  console.log(parsed);
  switch (instruction.parsed.type) {
    case 'transfer':
      return (
        <div>
          <div class="bu-columns">
            <div className="bu-column bu-is-4">From</div>
            <div className="bu-column bu-is-4">Amount</div>
            <div className="bu-column bu-is-4">To</div>
          </div>
          <div class="bu-columns">
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
  }
  // TODO
  return <table class="bu-table"></table>;

  // <div class="tag is-black">System: {SystemInstructionType[instNo]}</div>;
});
