const { SymbolTableImpl, Scope } = require('./symbol-table');
const { ASTNodes } = require('./ast');

const SymbolTable = new SymbolTableImpl();

const Eval = ast => {
  // The empty program evaluates to null.
  if (!ast) {
    return null;
  }

  // The literals evaluate to their values.
  if (ast.type === ASTNodes.Literal) {
    return ast.value;

  // The variables evaluate to the values
  // that are bound to them in the SymbolTable.
  } else if (ast.type === ASTNodes.Identifier) {
    return SymbolTable.lookup(ast.name);

  // if-then-else evaluates to the expression of the
  // then clause if the condition is true, otherwise
  // to the value of the else clause.
  } else if (ast.type === ASTNodes.Condition) {
    if (Eval(ast.condition)) {
      return Eval(ast.then);
    } else {
      return Eval(ast.el);
    }

  // The abstraction creates a new context of execution
  // and registers it's argument in the SymbolTable.
  } else if (ast.type === ASTNodes.Abstraction) {
    const scope = new Scope();
    return x => {
      scope.add(ast.arg.id.name, x);
      SymbolTable.push(scope);
      return Eval(ast.body);
    };

  // IsZero checks if the evaluated value of its
  // expression equals `0`.
  } else if (ast.type === ASTNodes.IsZero) {
    return Eval(ast.expression) === 0;

  // The arithmetic operations manipulate the value
  // of their corresponding expressions:
  // - `succ` adds 1.
  // - `pred` subtracts 1.
  } else if (ast.type === ASTNodes.Arithmetic) {
    const op = ast.operator;
    const val = Eval(ast.expression);
    switch (op) {
      case 'succ':
        return val + 1;
      case 'pred':
        return (val - 1 >= 0) ? val - 1 : val;
    }

  // The application evaluates to:
  // - Evaluation of the left expression.
  // - Evaluation of the right expression.
  // Application of the evaluation of the left expression over
  // the evaluated right expression.
  } else if (ast.type === ASTNodes.Application) {
    const l = Eval(ast.left);
    const r = Eval(ast.right);
    return l(r);
  }
  return true;
};

module.exports.Eval = Eval;

