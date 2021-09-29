const { numberWithSpaces } = await require('solarea://explorer/utils');

const ProgressBar = ({ percent = '100' }) => {
  return (
    <progress
      style={{ height: 16 }}
      className="bu-progress bu-is-success"
      value={percent}
      max="100"
    >
      {percent}%
    </progress>
  );
};

add(
  ({
    gradient = false,
    title,
    value = 0,
    progress = false,
    size = 'medium',
    info,
    children,
    color,
    subcard = false,
    style = {},
  }) => {
    const defaultColor = subcard ? 'var(--theme-subcard-bg-color)' : 'var(--theme-card-bg-color)';

    useCSS(
      'dashboard-card.css',
      css`
        .dashboard-card {
          color: var(--theme-main-color);
          position: relative;
          border-radius: var(--theme-border-radus);
          overflow: hidden;
          padding: 16px;
          width: 100%;
          margin-bottom: 20px;
          box-shadow: 0 4px 50px rgba(40, 61, 113, 0.1);
        }
        .dashboard-card.dashboard-card_subcard {
          box-shadow: none;
        }

        .dashboard-card_small > .dashboard-card__header,
        .dashboard-card_medium > .dashboard-card__header {
          font-size: var(--theme-xsmall-font-size);
        }
        .dashboard-card_small > .dashboard-card__content {
          font-size: var(--theme-small-font-size);
        }
        .dashboard-card_large > .dashboard-card__header,
        .dashboard-card_medium > .dashboard-card__content {
          font-size: var(--theme-medium-font-size);
        }
        .dashboard-card_large > .dashboard-card__content {
          font-size: var(--theme-large-font-size);
        }
        .dashboard-card:last-child {
          margin-bottom: 0;
        }
        .dashboard-card__header {
          width: 100%;
          display: flex;
          align-items: flex-start;
          margin-bottom: 4px;
        }
        .dashboard-card__title {
          font-weight: 600;
        }
        .dashboard-card__content {
          font-weight: bold;
          overflow: hidden;
        }
        .dashboard-card__content:empty {
          display: none;
        }
        .dashboard-card__info {
          font-weight: 600;
          font-size: 16px;
          text-align: right;
          margin-left: auto;
        }
      `,
    );

    return (
      <div
        className={`dashboard-card dashboard-card_${size} ${
          subcard ? 'dashboard-card_subcard' : ''
        }`}
        style={{
          background: gradient
            ? `radial-gradient( 300% 300% at 300% 250%, ${
                (color instanceof Object ? color.background : color) || 'transparent'
              } 0%, ${defaultColor}`
            : (color instanceof Object ? color.background : color) || defaultColor,
          ...style,
        }}
      >
        {title && (
          <header className="dashboard-card__header">
            <p className="dashboard-card__title">{title}</p>

            {info && (
              <div
                className="dashboard-card__info"
                style={{ color: color instanceof Object ? color.info : color }}
              >
                {info}
              </div>
            )}
          </header>
        )}
        <div
          className="dashboard-card__content"
          style={{
            color: color instanceof Object ? color.content : color,
          }}
        >
          {children ? (
            children
          ) : progress ? (
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div className="m-r-12">{value.toFixed(1) + '%'}</div>
              <ProgressBar percent={value.toFixed(1)} />
            </div>
          ) : (
            numberWithSpaces(value)
          )}
        </div>
      </div>
    );
  },
);
