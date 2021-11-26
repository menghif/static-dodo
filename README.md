# static-dodo

<img src="https://openclipart.org/image/400px/26541" alt="oksmith-dodo-bird" height="200" >

This Static Site Generator (SSG) command-line tool generates html files from text or markdown files.

A single `.txt` or `.md` file or txt files can be used as input.
A folder containing `.txt` or `.md` files can also be used as input.

All the html files will be created inside a new `./dist` folder. If a `./dist` folder already exists, the folder's content will be replaced with the html files created by `static-dodo`.

The fist line of the text will be used as the html title and will be placed inside of a `<h1>` tag.
Users can specify a CSS stylesheet using the option `-s` or `--stylesheet`

## Requirements

Requirements to install and run:

- LTS version of [NodeJS](https://nodejs.org/en/)
- [NPM](https://nodejs.org/en/knowledge/getting-started/npm/what-is-npm/) (comes preinstalled with NodeJS)

## Installation

To install the static-dodo command line tool, use:

```console
npm install -g static-dodo
```

This will allow you to use `static-dodo` from anywhere in your system.

## Usage

```
static-dodo --input file.txt
static-dodo --input file.md
static-dodo -i "Filename with spaces.txt"

static-dodo -i folder-name
static-dodo -i folder-name -s [CSS Stylesheet URL]
static-dodo -i folder-name --stylesheet [CSS Stylesheet URL]

static-dodo -c path-to-json-file
```

### JSON Configuration

You can use a JSON configuration file to pass options to `static-dodo`.

The JSON can accept the options `input` and `stylesheet`.
These options will override the ones passed in the command.

The `input` option in the JSON is **required**.

## Example Input

###### Dodo-Facts.txt

```
DODO Facts


The dodo (Raphus cucullatus) is an extinct flightless bird that was endemic to
the island of Mauritius, east of Madagascar in the Indian Ocean.

The first recorded mention of the dodo was by Dutch sailors in 1598.
```

## Example Output

###### ./dist/Dodo-Facts.html

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>DODO Facts</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <h1>DODO Facts</h1>

    <p>
      The dodo (Raphus cucullatus) is an extinct flightless bird that was endemic to the island of
      Mauritius, east of Madagascar in the Indian Ocean.
    </p>

    <p>The first recorded mention of the dodo was by Dutch sailors in 1598.</p>
  </body>
</html>
```

## Built With

- [Yargs](https://github.com/yargs/yargs) - Used for command line arguments
- [Markdown-it](https://github.com/markdown-it/markdown-it) - Used for Markdown support
- [Highlight.js](https://github.com/highlightjs/highlight.js) - Use for Markdown code highlight support

## Author

- **Francesco Menghi** - [Profile](https://github.com/menghif)

## License

This project is licensed under the [MIT License](LICENSE)
