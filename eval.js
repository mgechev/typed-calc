const { SymbolTableImpl, Scope } = require('./symbol-table');
const { ASTNodes } = require('./ast');

const SymbolTable = new SymbolTableImpl();

const Eval = ast => {
  if (!ast) {
    return null;
  }
  if (ast.type === ASTNodes.Literal) {
    return ast.value;
  } else if (ast.type === ASTNodes.Identifier) {
    return SymbolTable.lookup(ast.name);
  } else if (ast.type === ASTNodes.Condition) {
    if (Eval(ast.condition)) {
      return Eval(ast.then);
    } else {
      return Eval(ast.el);
    }
  } else if (ast.type === ASTNodes.Abstraction) {
    const scope = new Scope();
    return x => {
      scope.add(ast.arg.id.name, x);
      SymbolTable.push(scope);
      return Eval(ast.body);
    };
  } else if (ast.type === ASTNodes.IsZero) {
    return Eval(ast.expression) === 0;
  } else if (ast.type === ASTNodes.Arithmetic) {
    const op = ast.operator;
    const val = Eval(ast.expression);
    switch (op) {
      case 'succ':
        return val + 1;
      case 'pred':
        return val - 1;
    }
  } else if (ast.type === ASTNodes.Application) {
    const l = Eval(ast.left);
    const r = Eval(ast.right);
    return l(r);
  }
  return true;
};

module.exports.Eval = Eval;
