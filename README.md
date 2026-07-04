# Resumake

Resumake was a free, open-source LaTeX resume generator with no ads, no accounts, and no data collection. It helped tens of thousands of people create professional resumes.

This `main` branch currently serves the static Resumake farewell and update page at [resumake.io](https://resumake.io).

Source repository: [transprime-research/resumake.i.o](https://github.com/transprime-research/resumake.i.o)

## Current Status

The live site is no longer the full resume generator application. It is a static HTML page that explains the project history, points users toward modern resume-building options, and lets visitors send a message.

The previous application source is preserved in older branches of the upstream project. This repository is being prepared for the next phase of Resumake under the `transprime-research/resumake.i.o` GitHub organization.

## Branch Contents

This branch is intentionally small:

```text
index.html      Static farewell/update page
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

The static page currently includes:

- Google Analytics via `googletagmanager.com`
- Web3Forms for the contact form submission
- External links to tools such as Overleaf, Jobscan, and Resume Worded

No resume-generation data is processed by this branch because the generator app is not active here.

## License

This repository is licensed under AGPL-3.0-or-later. See [LICENSE](LICENSE) when present on branches that include the application source.
