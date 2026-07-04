# Resumake

Resumake was a free, open-source LaTeX resume generator with no ads, no accounts, and no data collection. It helped tens of thousands of people create professional resumes.

This `main` branch currently serves a simple static welcome page.

Source repository: [transprime-research/resumake.i.o](https://github.com/transprime-research/resumake.i.o)

## Current Status

The live site is no longer the full resume generator application. It is a static HTML welcome page while the project is prepared for its next phase.

The active app source code lives on the [`v4`](https://github.com/transprime-research/resumake.i.o/tree/v4) branch. This `main` branch is only the lightweight static page.

## Branch Contents

This branch is intentionally small:

```text
index.html      Static welcome page
_redirects      Netlify rewrite rule for single-page routing
netlify.toml    Netlify publish configuration
README.md       Project notes
```

There is no build step on this branch. Netlify serves the repository root directly.

## Local Preview

Open `index.html` directly in a browser, or serve the folder with any static file server:

```bash
npx serve .
```

## Deployment

This branch is configured for Netlify:

```toml
[build]
  publish = "."
```

The `_redirects` file sends all routes to `index.html`:

```text
/*  /index.html  200
```

## External Services

The static page currently includes links to:

- [transprime-research/resumake.i.o](https://github.com/transprime-research/resumake.i.o)
- [GitHub issues](https://github.com/transprime-research/resumake.i.o/issues)

No resume-generation data is processed by this branch because the generator app is not active here.

## License

This repository is licensed under AGPL-3.0-or-later. See [LICENSE](LICENSE) when present on branches that include the application source.
