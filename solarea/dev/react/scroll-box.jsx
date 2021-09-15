const ScrollBox = ({ minWidth = 550, children }) => {
  useCSS(
    'scroll-box.css',
    css`
      @media screen and (max-width: ${minWidth}px) {
        .scroll-box {
          overflow-x: scroll;
          overflow-y: hidden;
        }
        .scroll-box > div {
          min-width: ${minWidth}px;
          width: 100%;
        }
      }
    `,
  );

  return (
    <div class="scroll-box">
      <div>{children}</div>
    </div>
  );
};

add(ScrollBox);
