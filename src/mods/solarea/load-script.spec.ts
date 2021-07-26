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
  });
});
