const { SymbolTableImpl, Scope } = require('./symbol-table');
const { ASTNodes } = require('./ast');

const prettier = require("prettier");

const SymbolTable = new SymbolTableImpl();

const Transpile = ast => {
  // The empty program transpiles to an empty program ''.
  if (!ast) {
    return '';
  }

  // The literals transpile to their values.
  if (ast.type === ASTNodes.Literal) {
    return ast.value;

  // The variables transpile to the identifiers.
  } else if (ast.type === ASTNodes.Identifier) {
    return ast.name;

  // if-then-else transpiles to an if-then-else
  // construct in the target language.
} else if (ast.type === ASTNodes.Condition) {
    const targetCondition = Transpile(ast.condition);
    const targetThen = Transpile(ast.then);
    const targetElse = Transpile(ast.el);
    return `${targetCondition} ? ${targetThen} : ${targetElse}\n`;
  // The abstraction transpiles to a function
  // from the target language.
} else if (ast.type === ASTNodes.Abstraction) {
  return `(function (${ast.arg.id.name}) {
  return ${Transpile(ast.body)}
})`;

  // IsZero checks if the evaluated value of its
  // expression equals `0`.
  } else if (ast.type === ASTNodes.IsZero) {
    return `${Transpile(ast.expression)} === 0\n`;

  // The arithmetic operations manipulate the value
  // of their corresponding expressions:
  // - `succ` adds 1.
  // - `pred` substracts 1.
  } else if (ast.type === ASTNodes.Arithmetic) {
    const op = ast.operator;
    const val = Transpile(ast.expression);
    switch (op) {
      case 'succ':
        return `${val} + 1\n`;
      case 'pred':
        return `${val} - 1\n`;
    }

  // The application transpiles to:
  // Invocation of the transpiled left expression over
  // the transpiled right expression.
  } else if (ast.type === ASTNodes.Application) {
    const l = Transpile(ast.left);
    const r = Transpile(ast.right);
    return `${l}(${r})\n`;
  } else {
    return '';
  }
};

module.exports.Transpile = ast =>
  prettier.format(Transpile(ast), {
    printWidth: 80,
    tabWidth: 2,
    trailingComma: 'none',
    bracketSpacing: true,
    parser: 'babylon'
  });
