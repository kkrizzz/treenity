const Overview = styled.div([
  css`
    height: 100%;
    font-size: 14px;
    border-radius: 0.5rem;
    .bu-columns:not(:last-child) {
      margin-bottom: 0;
    }
    padding: 0.75rem;
    background: white;
    box-shadow: 0 0.5rem 1.2rem rgb(189 197 209 / 20%);

    .custom-header {
      border-bottom: 1px solid #e7eaf3;
    }
  `,
]);

add(Overview);
