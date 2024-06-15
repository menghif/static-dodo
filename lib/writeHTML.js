export default (title, body, stylesheet) => {
  return `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    ${stylesheet ? `<link rel="stylesheet" href="${stylesheet}">` : ""}
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/github.css">
  </head>
  <body>
    <h1>${title}</h1>
  ${body}
  </body>
  </html>`;
};
