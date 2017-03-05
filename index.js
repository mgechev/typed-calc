const { parse } = require('./simply-typed');
const { Check } = require('./check');
const { Eval } = require('./eval');
const { Transpile } = require('./transpiler');
const { readFileSync, existsSync } = require('fs');

const getAst = program => {
  const ast = parse(program);

  const diagnostics = Check(ast).diagnostics;
  if (diagnostics.length) {
    console.error(diagnostics.join('\n'));
    process.exit(1);
  }

  return ast;
};

const evaluate = program => Eval(getAst(program));
const transpile = program => Transpile(getAst(program));

const fileName = process.argv.pop();
const mode = process.argv.pop();

if (!existsSync(fileName)) {
  console.error(`"${fileName}" does not exist.`)
  process.exit(1);
}

const program = readFileSync(fileName, { encoding: 'utf-8' });

if (mode === 'transpile') {
  console.log(transpile(program));
} else {
  console.log(evaluate(program));
}
