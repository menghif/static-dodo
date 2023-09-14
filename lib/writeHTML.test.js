const { writeHTML } = require("./writeHTML");

test("writeHTML with Title, Body and Stylesheet should return correct html", () => {
  expect(writeHTML("Title", "Body", "Stylesheet")).toBe(
    `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="Stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/github.css">
  </head>
  <body>
    <h1>Title</h1>
  Body
  </body>
  </html>`,
  );
});

test("writeHTML without Stylesheet should not include stylesheet", () => {
  expect(writeHTML("Title", "Body")).toBe(
    `<!doctype html>
  <html lang="en">
  <head>
    <meta charset="utf-8">
    <title>Title</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/highlightjs@9.16.2/styles/github.css">
  </head>
  <body>
    <h1>Title</h1>
  Body
  </body>
  </html>`,
  );
});
