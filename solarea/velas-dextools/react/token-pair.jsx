const Dropdown = render('velas-dextools', 'dropdown');

const ChangeIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.666748 1.66666V5.66666M0.666748 5.66666H4.66675M0.666748 5.66666L3.76008 2.75999C4.47658 2.04314 5.363 1.51947 6.33662 1.23784C7.31024 0.956222 8.33934 0.925829 9.32789 1.1495C10.3164 1.37317 11.2322 1.84362 11.9898 2.51694C12.7473 3.19026 13.322 4.04452 13.6601 4.99999M15.3334 12.3333V8.33333M15.3334 8.33333H11.3334M15.3334 8.33333L12.2401 11.24C11.5236 11.9569 10.6372 12.4805 9.66354 12.7621C8.68992 13.0438 7.66082 13.0742 6.67227 12.8505C5.68372 12.6268 4.76795 12.1564 4.01039 11.483C3.25284 10.8097 2.67819 9.95547 2.34008 8.99999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const WarningIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M10.29 3.86001L1.81999 18C1.64536 18.3024 1.55296 18.6453 1.55198 18.9945C1.551 19.3437 1.64148 19.6871 1.81442 19.9905C1.98735 20.2939 2.23672 20.5468 2.5377 20.7239C2.83868 20.901 3.18079 20.9962 3.52999 21H20.47C20.8192 20.9962 21.1613 20.901 21.4623 20.7239C21.7633 20.5468 22.0126 20.2939 22.1856 19.9905C22.3585 19.6871 22.449 19.3437 22.448 18.9945C22.447 18.6453 22.3546 18.3024 22.18 18L13.71 3.86001C13.5317 3.56611 13.2807 3.32313 12.9812 3.15449C12.6817 2.98585 12.3437 2.89726 12 2.89726C11.6563 2.89726 11.3183 2.98585 11.0188 3.15449C10.7193 3.32313 10.4683 3.56611 10.29 3.86001V3.86001Z"
      stroke="#FFB800"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 9V13"
      stroke="#FFB800"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 17H12.01"
      stroke="#FFB800"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const prepareOptions = (markets) =>
  markets
    .slice()
    .sort((m1, m2) => m2.kind - m1.kind)
    .map((m) => ({
      value: m.quote.address,
      text: m.quote.symbol,
      content: () => (
        <div
          title="This token IS NOT TRUSTED. please DYOR"
          style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {m.quote.symbol}
          {m.kind === 1 && <WarningIcon />}
        </div>
      ),
    }));

const TokenPair = ({ base, quote, baseMarkets, quoteMarkets, onMarketChange, className }) => {
  const baseOptions = prepareOptions(quoteMarkets);
  const quoteOptions = prepareOptions(baseMarkets);

  const onChange = (baseAddress, quoteAddress) => {
    if (onMarketChange) onMarketChange(baseAddress, quoteAddress);
  };

  return (
    <StyledTokenPair className={className}>
      <div>
        <Dropdown
          value={base.address}
          options={baseOptions}
          onChange={(v) => onChange(v, quote.address)}
        />

        <button title="Swap" onClick={() => onChange(quote.address, base.address)}>
          <ChangeIcon />
        </button>
      </div>
      <div>
        <Dropdown
          value={quote.address}
          options={quoteOptions}
          onChange={(v) => onChange(base.address, v)}
        />
      </div>
    </StyledTokenPair>
  );
};

const StyledTokenPair = styled.div`
  position: relative;
  display: flex;
  width: max-content;
  height: 52px;
  z-index: 10;

  .dropdown__main {
    width: max-content !important;
    min-width: 160px !important;
    background: transparent !important;
    text-align: center;
  }

  & > div {
    height: 52px;
    //min-width: 120px;
    background: ${(props) => props.theme.colors.cardBG};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & > div:first-child {
    position: relative;

    background: ${(props) => props.theme.colors.subcardBG};
    border-right: 1px solid ${(props) => props.theme.colors.border};
    border-radius: 6px 0 0 6px;

    .dropdown__main {
      padding: 16px 24px 16px 40px !important;
    }
    .dropdown__main:after {
      left: 16px;
    }
  }
  & > div:last-child {
    border-radius: 0 6px 6px 0;
    border-left: 1px solid ${(props) => props.theme.colors.border};

    .dropdown__main {
      padding: 16px 40px 16px 24px !important;
    }
  }
  & button {
    display: flex;
    justify-content: center;
    align-items: center;

    color: ${(props) => props.theme.colors.secondaryContent};
    position: absolute;
    right: -16px;
    top: calc(50% - 16px);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colors.border};
    background: ${(props) => props.theme.colors.cardBG};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    padding: 0;
  }
  & button:hover {
    filter: brightness(95%);
  }

  .dextools-custom-select select {
    color: ${(props) => props.theme.colors.main} !important;
    padding-right: 18px !important;
    background: transparent;
    border: none;
  }
  .dextools-custom-select select:hover {
    color: ${(props) => props.theme.colors.main} !important;
  }

  .dextools-custom-select:after {
    right: 0 !important;
    border-color: ${(props) => props.theme.colors.secondaryContent} !important;
  }
  .dextools-custom-select:hover:after {
    border-color: ${(props) => props.theme.colors.secondaryContent} !important;
  }
  .dextools-custom-select select:active {
    border: none;
    box-shadow: none;
  }

  .dextools-custom-select select:focus {
    box-shadow: none;
  }
`;
add(TokenPair);
