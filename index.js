const { parse } = require('./simply-typed');
const { Check } = require('./check');
const { Eval } = require('./eval');
const { readFileSync, existsSync } = require('fs');

const evaluate = program => {
  const ast = parse(program);

  const diagnostics = Check(ast).diagnostics;

  if (diagnostics.length) {
    console.error(diagnostics.join('\n'));
    process.exit(1);
  }

  return Eval(ast);
};

const fileName = process.argv.pop();

if (!existsSync(fileName)) {
  console.error(`"${fileName}" does not exist.`)
  process.exit(1);
}

console.log(evaluate(readFileSync(fileName, { encoding: 'utf-8' })));

// const ast1 = parse('');
// const ast2 = parse('');

// console.log(Check(ast1));
// console.log(Check(ast2));

// console.log(Eval(ast1));
// console.log(Eval(ast2));

