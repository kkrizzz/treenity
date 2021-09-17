add(() => {
  useCSS(
    'near-dashboard-token-price.css',
    css`
      .asset-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
      }

      .asset-wrapper {
        padding: 8px;
        border-radius: 1rem;
        background: #f3f5f7;
        display: flex;
        justify-content: flex-start;
        align-items: center;
      }
      .asset-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
      }

      .asset-info-symbol {
        font-weight: bold;
      }
    `,
  );
  return null;
});
