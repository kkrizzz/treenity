const Wrapper = styled.div([
  css`
    .latest-info {
      background: white;
      background: white;
      padding-left: 0.75rem;
      padding-top: 0.75rem;
      padding-bottom: 0.75rem;
    }

    .bu-tabs ul {
      border: none;
    }

    .bu-tabs .bu-is-active {
      opacity: 1;
      color: #000000 !important;
      background: #ffffff;
      border-bottom: 1px solid #c1c1c1;
    }

    .bu-tabs {
      color: black;
      margin-bottom: 0;
      background: white;
    }

    .bu-tabs li {
      color: rgba(74, 79, 85, 0.8);
      border-radius: 0;
      padding: 0.75rem;
      font-size: 14px;
    }

    table {
      border-radius: 0;
    }

    tbody,
    thead {
      background: white !important;
    }

    th,
    td {
      border-bottom: 1px solid #e7eaf3;
      border-collapse: collapse;
    }

    tbody tr:nth-child(even) {
      background-color: white;
    }

    .tabs-wrapper {
      border-radius: 0.5rem;
    }

    tr td {
      font-size: 14px !important;
      font-weight: 200 !important;
      padding: 0.75rem;
    }
  `,
]);

add(Wrapper);
