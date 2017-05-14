const { SymbolTableImpl, Scope } = require('./symbol-table');
const { ASTNodes } = require('./ast');

const prettier = require("prettier");

const SymbolTable = new SymbolTableImpl();

const CompileJS = ast => {
  // The empty program compiles to an empty program ''.
  if (!ast) {
    return '';
  }

  // The literals compile to their values.
  if (ast.type === ASTNodes.Literal) {
    return ast.value;

  // The variables compile to the identifiers.
  } else if (ast.type === ASTNodes.Identifier) {
    return ast.name;

  // if-then-else compiles to an if-then-else
  // construct in the target language.
} else if (ast.type === ASTNodes.Condition) {
    const targetCondition = CompileJS(ast.condition);
    const targetThen = CompileJS(ast.then);
    const targetElse = CompileJS(ast.el);
    return `${targetCondition} ? ${targetThen} : ${targetElse}\n`;
  // The abstraction compiles to a function
  // from the target language.
} else if (ast.type === ASTNodes.Abstraction) {
  return `(function (${ast.arg.id.name}) {
  return ${CompileJS(ast.body)}
})`;

  // IsZero checks if the evaluated value of its
  // expression equals `0`.
  } else if (ast.type === ASTNodes.IsZero) {
    return `${CompileJS(ast.expression)} === 0\n`;

  // The arithmetic operations manipulate the value
  // of their corresponding expressions:
  // - `succ` adds 1.
  // - `pred` substracts 1.
  } else if (ast.type === ASTNodes.Arithmetic) {
    const op = ast.operator;
    const val = CompileJS(ast.expression);
    switch (op) {
      case 'succ':
        return `${val} + 1\n`;
      case 'pred':
        return `${val} - 1\n`;
    }

  // The application compiles to:
  // Invocation of the compiled left expression over
  // the compiled right expression.
  } else if (ast.type === ASTNodes.Application) {
    const l = CompileJS(ast.left);
    const r = CompileJS(ast.right);
    return `${l}(${r})\n`;
  } else {
    return '';
  }
};

module.exports.CompileJS = ast =>
  prettier.format(CompileJS(ast), {
    printWidth: 80,
    tabWidth: 2,
    trailingComma: 'none',
    bracketSpacing: true,
    parser: 'babylon'
  });
