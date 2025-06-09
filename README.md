# APD Marketing

This repository contains sample code for a multi-step quote estimator form which can be embedded in a WordPress site using Elementor. The form files live inside the `quote-estimator` directory.

## Running Locally

Start a simple web server from the repository root:

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080/quote-estimator/` in your browser to view the estimator. No build steps are required because all dependencies are loaded from CDNs.

## Embedding in WordPress

Upload the files from `quote-estimator` to your theme or include the HTML in an Elementor HTML widget. Ensure `script.js` and `style.css` are referenced correctly relative to your page.
