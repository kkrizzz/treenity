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
  }) => {
    const titleFontSize = size === 'medium' ? 14 : size === 'small' ? 14 : 20;
    const contentFontSize = size === 'medium' ? 20 : size === 'small' ? 16 : 40;
    const defaultColor = subcard ? 'var(--theme-subcard-bg-color)' : 'var(--theme-card-bg-color)';

    useCSS(
      'dashboard-card.css',
      css`
        .dashboard-card {
          color: var(--theme-main-color);
          position: relative;
          border-radius: 16px !important;
          padding: 16px !important;
          width: 100%;
          margin-bottom: 20px;
        }
        .dashboard-card:last-child {
          margin-bottom: 0;
        }
        .dashboard-card__header {
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
          line-height: 19px;
          position: absolute;
          right: 12px;
          top: 12px;
          text-align: right;
        }
      `,
    );

    return (
      <div
        className={`dashboard-card`}
        style={{
          boxShadow: subcard ? 'none' : '0 4px 50px rgba(40, 61, 113, 0.1)',
          background: gradient
            ? `radial-gradient( 300% 300% at 300% 250%, ${
                (color instanceof Object ? color.background : color) || 'transparent'
              } 0%, ${defaultColor}`
            : (color instanceof Object ? color.background : color) || defaultColor,
        }}
      >
        {title && (
          <header className="dashboard-card__header">
            <p className="dashboard-card__title" style={{ fontSize: titleFontSize }}>
              {title}
            </p>
          </header>
        )}
        <div
          className="dashboard-card__content"
          style={{
            fontSize: contentFontSize,
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
        {info && (
          <div
            className="dashboard-card__info"
            style={{ color: color instanceof Object ? color.info : color }}
          >
            {info}
          </div>
        )}
      </div>
    );
  },
);
