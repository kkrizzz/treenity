import { reactToHtmPreact } from './load-script';

describe('load-script', () => {
  describe('compilation', () => {
    it('compile map', () => {
      const htmlText = reactToHtmPreact(`
        <div>
        {coins.chunk(2).map(ch => (
        <div className="row">
          {ch.map(([name, quote, mint]) => 
          <div className="col-md-6">
            DFX/BUSD - 0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF 
            <a href="/pancake:chart:busd?coin=0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF">pancake chart</a>
            <Render id="pancake:chart:busd" coin="0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF" />
          </div>
        )}
       </div>
       )}
      </div>
      `);

      console.log(htmlText);

      expect(htmlText).toBe(`
        html\`<div>
        \${coins.chunk(2).map(ch => (
        html\`<div className="row">
          \${ch.map(([name, quote, mint]) => 
          html\`<div className="col-md-6">
            DFX/BUSD - 0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF 
            <a href="/pancake:chart:busd?coin=0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF">pancake chart</a>
            <\${Render} id="pancake:chart:busd" coin="0x74B3abB94e9e1ECc25Bd77d6872949B4a9B2aACF" />
          </div>\`
        )}
       </div>\`
       )}
      </div>\`
      `);
    });
    it('compile self-closing-tag', () => {
      const htmlText = reactToHtmPreact(`<div/>`);

      console.log(htmlText);

      expect(htmlText).toBe(`html\`<div/>\``);
    });

    it('compile shift operation', () => {
      const htmlText = reactToHtmPreact(`
      a = 5 << 10;
      return <div />;
      `);

      console.log(htmlText);

      expect(htmlText).toBe(`
      a = 5 << 10;
      return html\`<div />\`;
      `);
    });
    it('compile inner ternary ?:', () => {
      const htmlText = reactToHtmPreact(`
      <Render id="dev" name="bulma-card" header="Account Inputs">
        {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}
      </Render>
      `);

      console.log(htmlText);

      expect(htmlText).toBe(`
      html\`<\${Render} id="dev" name="bulma-card" header="Account Inputs">
        \${isLoading ? html\`<span class="spinner"></span>\` : html\`<\${AccountInputs} tx=\${tx}></AccountInputs>\`}
      </Render>\`
      `);
    });
    it('compile fragment', () => {
      const htmlText = reactToHtmPreact(`
      <>
        <Render id="dev" name="bulma-card" header="Account Inputs">
          {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}
        </Render>
        <div />
      </>
      `);

      console.log(htmlText);

      expect(htmlText).toBe(`
      html\`
        <\${Render} id="dev" name="bulma-card" header="Account Inputs">
          \${isLoading ? html\`<span class="spinner"></span>\` : html\`<\${AccountInputs} tx=\${tx}></AccountInputs>\`}
        </Render>
        <div />
      \`
      `);
    });

    it('skip comments', () => {
      const htmlText = reactToHtmPreact(`
      <>
        <Render id="dev" name="bulma-card" header="Account Inputs">
          {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}
        </Render>
        {/*<Render id="dev" name="bulma-card" header="Account Inputs">*/}1
        {/*  {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}*/}2
        {/*</Render>*/}3
        <div />
      </>
      `);

      expect(htmlText).toBe(`
      html\`
        <\${Render} id="dev" name="bulma-card" header="Account Inputs">
          \${isLoading ? html\`<span class="spinner"></span>\` : html\`<\${AccountInputs} tx=\${tx}></AccountInputs>\`}
        </Render>
        {/*<\${Render} id="dev" name="bulma-card" header="Account Inputs">*/}1
        {/*  \${isLoading ? html\`<span class="spinner"></span>\` : html\`<\${AccountInputs} tx=\${tx}></AccountInputs>\`}*/}2
        {/*</Render>*/}3
        <div />
      \`
      `);
    });

    it('skip multiline comment', () => {
      const htmlText = reactToHtmPreact(`
      <>
        <Render id="dev" name="bulma-card" header="Account Inputs">
          {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}
        </Render>
        {/*<Render id="dev" name="bulma-card" header="Account Inputs">
          {isLoading ? <span class="spinner"></span> : <AccountInputs tx={tx}></AccountInputs>}
        </Render>*/}
        <div />
      </>
      `);
      console.log(htmlText);

      expect(htmlText).toBe(`
      html\`
        <\${Render} id="dev" name="bulma-card" header="Account Inputs">
          \${isLoading ? html\`<span class="spinner"></span>\` : html\`<\${AccountInputs} tx=\${tx}></AccountInputs>\`}
        </Render>
        {/*<\${Render} id="dev" name="bulma-card" header="Account Inputs">
          \${isLoading ? html\`<span class="spinner"></span>\` : html\`<\${AccountInputs} tx=\${tx}></AccountInputs>\`}
        </Render>*/}
        <div />
      \`
      `);
    });
    it('spread props', () => {
      const htmlText = reactToHtmPreact(`<{ClusterStats} {...{ test: true }} />`);
      expect(htmlText).toBe(`html\`<\${ClusterStats} ...\${{ test: true }} />\``);
    });
  });
});
