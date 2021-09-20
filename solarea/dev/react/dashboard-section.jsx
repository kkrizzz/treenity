add(({ title, children }) => {
  useCSS(
    'dashboard-section.css',
    css`
      .dashboard-section {
        color: var(--theme-main-color);
        margin-bottom: 40px !important;
      }
      .dashboard-section__title {
        font-weight: 600;
        font-size: 20px;
        line-height: 24px;
        color: var(--theme-main-color);
      }

      .dashboard-section__separate-line {
        margin: 16px 0;
        width: 48px;
        height: 1px;
        left: 688px;
        top: 245px;

        background: #788cbf;
        border-radius: 1px;
      }
    `,
  );

  return (
    <div class="bu-block dashboard-section">
      <div class="dashboard-section__title">{title}</div>
      <div class="dashboard-section__separate-line" />
      <div class="dashboard-section__content">{children}</div>
    </div>
  );
});
