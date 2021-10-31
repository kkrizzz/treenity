const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M3.33325 10H2.66659C2.31296 10 1.97382 9.85952 1.72378 9.60947C1.47373 9.35942 1.33325 9.02028 1.33325 8.66666V2.66666C1.33325 2.31304 1.47373 1.9739 1.72378 1.72385C1.97382 1.4738 2.31296 1.33333 2.66659 1.33333H8.66659C9.02021 1.33333 9.35935 1.4738 9.60939 1.72385C9.85944 1.9739 9.99992 2.31304 9.99992 2.66666V3.33333M7.33325 6H13.3333C14.0696 6 14.6666 6.59695 14.6666 7.33333V13.3333C14.6666 14.0697 14.0696 14.6667 13.3333 14.6667H7.33325C6.59687 14.6667 5.99992 14.0697 5.99992 13.3333V7.33333C5.99992 6.59695 6.59687 6 7.33325 6Z"
      stroke="#BABFC5"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
    />
  </svg>
);

const Icon = () => {
  useCSS(
    'copy-icon-hash.css',
    css`
      .copy-icon {
        color: var(--theme-main-content-color);
      }

      .copy-icon svg {
        width: 14px;
        height: 14px;
        //margin: 6px;
        display: flex;
      }
    `,
  );

  return (
    <div className="copy-icon">
      <CopyIcon />
    </div>
  );
};

const VelasHash = ({ id, ...props }) => {
  return <Render icon={<Icon />} {...props} id="dev" name="hash" />;
};

add(VelasHash);
