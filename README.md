# dodo-SSG

This Static Site Generator (SSG) command-line tool generates html files using txt files.

A single txt file or a folder containing txt files can be used as input.

All the html files will be created inside a new dist folder.

## Prerequisites

Requirements for the software:

- [NodeJS](https://nodejs.org/en/)

## Installing

`npm install`

## Usage

```
my-ssg --input file.txt
my-ssg -i ./folder-name
dodo-SSG -i folder-name -s [CSS Stylesheet URL]

```

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
      The dodo (Raphus cucullatus) is an extinct flightless bird that was
      endemic to the island of Mauritius, east of Madagascar in the Indian
      Ocean.
    </p>

    <p>The first recorded mention of the dodo was by Dutch sailors in 1598.</p>
  </body>
</html>
```

## Built With

- [Yargs](https://github.com/yargs/yargs) - Used for command line arguments

## Author

- **Francesco Menghi** - [Profile](https://github.com/menghif)

## License

This project is licensed under the [MIT License](LICENSE)
