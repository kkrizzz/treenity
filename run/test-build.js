let exampleOnResolvePlugin = {
  name: 'example',
  setup(build) {
    let path = require('path');

    // Redirect all paths starting with "images/" to "./public/images/"
    build.onResolve({ filter: /^images\// }, args => {
      return { path: path.join(args.resolveDir, 'public', args.path) };
    });

    build.onResolve({ filter: /mods/ }, args => {
      console.log(args);
      return { namespace: 'mods' };
    });

    // Mark all paths starting with "http://" or "https://" as external
    build.onResolve({ filter: /^https?:\/\// }, args => {
      return { path: args.path, external: true };
    });
  },
};

require('esbuild').build({
  entryPoints: ['src/server/index.ts'],
  bundle: true,
  outfile: 'out.js',
  plugins: [exampleOnResolvePlugin],
  loader: { '.png': 'binary' },
  platform: 'node',
}).catch(() => process.exit(1));
