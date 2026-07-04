> [!NOTE]
> Resumake is currently undergoing a major v3 rewrite.

# resumake.io

A website for automatically generating elegant LaTeX resumes without the need to write any TeX code yourself.

Source: [transprime-research/resumake.i.o](https://github.com/transprime-research/resumake.i.o)

![resumake](https://i.imgur.com/QUoFVmG.png)

Simply choose a template, fill in as much (or as little) info as you want, and then press <kbd>Make</kbd> to see your output. You can change your template at any point to see how your resume looks with different designs.

When you're happy with your result, you can download the resume as a PDF, TeX, or JSON document. The JSON output is compatible with [JSONResume](https://jsonresume.org).

## Development

Install dependencies:

```bash
npm install
```

Download the browser TeX engine assets:

```bash
npm run download:texlyre-assets
```

Run the development server:

```bash
npm run dev
```

The app uses [TeXlyre BusyTeX](https://github.com/TeXlyre/texlyre-busytex) to compile LaTeX in the browser. The TeXlyre runtime and TeX Live bundles are downloaded into `public/core/busytex`.

`public/core` is generated asset output and is large. Prefer downloading it during local setup or deployment instead of committing it directly to git.

## Deployment

Make sure the TeXlyre assets are present before building or serving the app:

```bash
npm run download:texlyre-assets
npm run build
npm run start
```

The app source can be hosted on GitHub. For production hosting, use a Node/Next.js host such as Vercel, Netlify, Render, Fly.io, or your own server. GitHub Pages requires extra static-export work and is not the default deployment target for this app.

## Credits
Thanks very much to the creators of the LaTeX templates used in this website.

* [Rensselaer Career Development Center](https://www.rpi.edu/dept/arc/training/latex/resumes/)
* [Byungjin Park](https://github.com/posquit0)
* [Scott Clark](https://github.com/sc932)
* [Debarghya Das](https://github.com/deedy)
* [Xavier Danaux](https://github.com/xdanaux)
* [Ratul Saha](https://github.com/RatulSaha)
* [Daniil Belyakov](https://github.com/dnl-blkv)
* [Frits Wenneker](https://www.overleaf.com/latex/templates/your-new-cv/xqzhcmqkqrtw)

## License
AGPL-3.0-or-later. See [LICENSE](LICENSE).
