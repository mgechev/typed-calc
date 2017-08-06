const { parse } = require('./simply-typed');
const { Check } = require('./check');
const { Eval } = require('./eval');
const { green, red } = require('chalk');
const { CompileJS } = require('./compile');
const { CompileWat } = require('./compile-wat');
const { readFileSync, existsSync } = require('fs');

const getAst = program => {
  const ast = parse(program);

  const diagnostics = Check(ast).diagnostics;
  if (diagnostics.length) {
    console.error(red(diagnostics.join('\n')));
    process.exit(1);
  }

  return ast;
};

const fileName = process.argv.pop();
let mode = process.argv.pop();
let target = process.argv.pop();

if (mode === 'wat' || target === 'compile') {
  [mode, target] = [target, mode];
}

if (!existsSync(fileName)) {
  console.error(`"${fileName}" does not exist.`)
  process.exit(1);
}

const shouldCompile = mode === 'compile';

const userMessage = (shouldCompile ? 'Compiling' : 'Evaluating') +
  ` "${fileName}"` +
  (shouldCompile ? ` to ` + (target === 'wat' ? 'WebAssembly' : 'JavaScript') : '') + '.';

console.log(green(userMessage));
console.log();

const program = readFileSync(fileName, { encoding: 'utf-8' });
const ast = getAst(program);

if (mode === 'compile') {
  let result = '';
  if (target === 'wat') {
    result = CompileWat(ast);
  } else {
    result = CompileJS(ast);
  }
  console.log(result);
} else {
  console.log(Eval(ast));
}
