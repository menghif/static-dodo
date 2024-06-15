// Shows a help message.
export const getHelp = () => {
  const helpMessage = `
Simple CLI tool to generate HTML pages from Markdown or txt files. 🦤

Usage: static-dodo [options]

Options:

  -i, --input       Load input file or directory

  -s, --stylesheet  Provide custom stylesheet
  
  -c, --config      Provide a path to a JSON file

  -v, --version     Display the version number
  
  -h, --help        Display the help menu

Examples:

  static-dodo --input file.md
  static-dodo -i file.txt --stylesheet style.css 
  static-dodo --input folder


For more help, visit: https://github.com/menghif/static-dodo
`;

  return console.log(helpMessage);
};
