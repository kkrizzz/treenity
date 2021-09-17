function ExampleComponent({ content }) {
  useCSS(
    'example-component.css',
    css`
      .example-component {
        height: 60px;
        width: 100%;
        text-align: center;
      }
    `,
  );

  return <div className="example-component">Hello world from {content}!!!</div>;
}

add(ExampleComponent);
