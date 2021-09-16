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
    gradient = true,
    title,
    value = 0,
    progress = false,
    size = 'medium',
    info,
    children,
    color,
  }) => {
    const titleFontSize = size === 'medium' ? 14 : 20;
    const contentFontSize = size === 'medium' ? 20 : 40;

    useCSS(
      'dashboard-card.css',
      css`
        .dashboard-card {
          position: relative;
          border-radius: 16px !important;
          padding: 16px !important;
        }
        .dashboard-card__header {
          margin-bottom: 4px;
        }
        .dashboard-card__title {
          font-weight: 600;
        }
        .dashboard-card__content {
          font-weight: bold;
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
        className={`bu-card dashboard-card`}
        style={{
          background: gradient
            ? `radial-gradient( 200.42% 204.83% at -120% -50%, ${
                (color instanceof Object ? color.background : color) || 'transparent'
              } 0%, var(--theme-d-card-bg-color) 100%)`
            : color instanceof Object
            ? color.background
            : color,
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
