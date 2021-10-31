const StyledTokenPair = styled.div`
  position: relative;
  display: flex;
  border-radius: 6px;
  overflow: hidden;
  height: 52px;

  & > div {
    height: 52px;
    width: 120px;
    background: ${(props) => props.theme.colors.cardBG};
    display: flex;
    justify-content: center;
    align-items: center;
  }
  & > div:first-child {
    filter: brightness(130%);
    -webkit-filter: brightness(130%);
    border-right: 1px solid ${(props) => props.theme.colors.border};
  }
  & > div:last-child {
    border-left: 1px solid ${(props) => props.theme.colors.border};
  }
  & > button {
    display: flex;
    justify-content: center;
    align-items: center;

    color: ${(props) => props.theme.colors.secondaryContent};
    position: absolute;
    left: calc(50% - 16px);
    top: calc(50% - 16px);
    width: 32px;
    height: 32px;
    border-radius: 50%;
    border: 2px solid ${(props) => props.theme.colors.border};
    background: ${(props) => props.theme.colors.cardBG};
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
  & > button:hover {
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

const ChangeIcon = () => (
  <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0.666748 1.66666V5.66666M0.666748 5.66666H4.66675M0.666748 5.66666L3.76008 2.75999C4.47658 2.04314 5.363 1.51947 6.33662 1.23784C7.31024 0.956222 8.33934 0.925829 9.32789 1.1495C10.3164 1.37317 11.2322 1.84362 11.9898 2.51694C12.7473 3.19026 13.322 4.04452 13.6601 4.99999M15.3334 12.3333V8.33333M15.3334 8.33333H11.3334M15.3334 8.33333L12.2401 11.24C11.5236 11.9569 10.6372 12.4805 9.66354 12.7621C8.68992 13.0438 7.66082 13.0742 6.67227 12.8505C5.68372 12.6268 4.76795 12.1564 4.01039 11.483C3.25284 10.8097 2.67819 9.95547 2.34008 8.99999"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TokenPair = ({ base, markets, currentMarket, onSwap, onMarketChange, className }) => {
  return (
    <StyledTokenPair className={className}>
      <div>{base}</div>
      <button title="Swap" onClick={onSwap}>
        <ChangeIcon />
      </button>
      <div>
        <div className="bu-select dextools-custom-select">
          <select
            value={currentMarket}
            onChange={(e) => onMarketChange && onMarketChange(e.target.value)}
          >
            {markets.map((m) => (
              <option value={m.market}>{m.quote.symbol}</option>
            ))}
          </select>
        </div>
      </div>
    </StyledTokenPair>
  );
};

add(TokenPair);
