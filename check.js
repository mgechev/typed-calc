const { SymbolTableImpl, Scope } = require('./symbol-table');
const { ASTNodes } = require('./ast');

const SymbolTable = new SymbolTableImpl();

const Types = {
  Natural: 'Nat',
  Boolean: 'Bool'
};

const typeEq = (a, b) => {
  if (a instanceof Array && b instanceof Array) {
    if (a.length !== b.length) {
      return false;
    } else {
      for (let i = 0; i < a.length; i += 1) {
        if (!typeEq(a[i], b[i])) {
          return false;
        }
      }
      return true;
    }
  } else {
    if (typeof a === 'string' && typeof b === 'string') {
      return a === b;
    }
  }
  return false;
};

const Check = (ast, diagnostics) => {
  diagnostics = diagnostics || [];

  // By definition empty AST is correct
  if (!ast) {
    return {
      diagnostics
    };
  }

  // Literals:
  // - 0 is of type Natural
  // - false and true are of type Boolean
  // Everything else is incorrect.
  if (ast.type === ASTNodes.Literal) {
    if (ast.value === 0) {
      return {
        diagnostics,
        type: Types.Natural
      };
    } else if (ast.value === false || ast.value === true) {
      return {
        diagnostics,
        type: Types.Boolean
      };
    } else {
      diagnostics.push('Unknown type literal!');
      return {
        diagnostics
      };
    }

  // We get the type of identifier from the symbol table
  } else if (ast.type === ASTNodes.Identifier) {
    return {
      diagnostics,
      type: SymbolTable.lookup(ast.name)
    };

  // if-then-else block is correct if:
  // - The condition is of type Boolean.
  // - Then and else are of the same type.
  } else if (ast.type === ASTNodes.Condition) {
    if (!ast.then || !ast.el || !ast.condition) {
      diagnostics.push('No condition for if statement');
      return {
        diagnostics
      };
    }
    const c = Check(ast.condition);
    diagnostics = diagnostics.concat(c.diagnostics);
    const conditionType = c.type;
    if (!typeEq(conditionType, Types.Boolean)) {
      diagnostics.push('Incorrect type of condition of condition!');
      return {
        diagnostics
      };
    }
    const thenBranch = Check(ast.then);
    diagnostics = diagnostics.concat(thenBranch.diagnostics);
    const thenBranchType = thenBranch.type;
    const elseBranch = Check(ast.el);
    diagnostics = diagnostics.concat(elseBranch.diagnostics);
    const elseBranchType = elseBranch.type;
    if (typeEq(thenBranchType, elseBranchType)) {
      return thenBranch;
    } else {
      diagnostics.push('Incorrect type of then/else branches!');
      return {
        diagnostics
      };
    }

  // Abstraction registers its argument in the SymbolTable
  // and returns a pair:
  // - The type of its argument.
  // - Type of its body, which may depend on the type
  // of the argument registered in the SymbolTable.
  } else if (ast.type === ASTNodes.Abstraction) {
    const scope = new Scope();
    scope.add(ast.arg.id.name, ast.arg.type);
    SymbolTable.push(scope);
    if (!ast.body) {
      diagnostics.push('No body of a function');
      return {
        diagnostics
      };
    }
    const body = Check(ast.body);
    const bodyType = body.type;
    diagnostics = diagnostics.concat(body.diagnostics);
    if (!bodyType) {
      diagnostics.push('Incorrect type of the body');
      return {
        diagnostics
      };
    }
    return {
      diagnostics,
      type: [ast.arg.type, bodyType]
    }

  // The type of IsZero is Boolean but in case
  // its argument is not Natural the program is incorrect.
  } else if (ast.type === ASTNodes.IsZero) {
    const body = Check(ast.expression);
    diagnostics = diagnostics.concat(body.diagnostics);
    const bodyType = body.type;
    if (!typeEq(bodyType, Types.Natural)) {
      diagnostics.push('Incorrect type of IsZero');
      return {
        diagnostics
      };
    }
    return {
      diagnostics,
      type: Types.Boolean
    }

  // The type of the arithmetic operations are Natural
  // but in case the type of the body is not the entire
  // program is incorrect.
  } else if (ast.type === ASTNodes.Arithmetic) {
    const body = Check(ast.expression);
    diagnostics = diagnostics.concat(body.diagnostics);
    const bodyType = body.type;
    if (!typeEq(bodyType, Types.Natural)) {
      diagnostics.push(`Incorrect type of ${ast.operation}`);
      return {
        diagnostics
      };
    }
    return {
      diagnostics,
      type: Types.Natural
    };

  // The type of:
  // e1: T1, e2: T2, e1 e2: T1
  } else if (ast.type === ASTNodes.Application) {
    const l = Check(ast.left);
    const leftType = l.type || [];
    diagnostics = diagnostics.concat(l.diagnostics);
    const r = Check(ast.right);
    const rightType = r.type || [];
    diagnostics = diagnostics.concat(r.diagnostics);
    if (leftType.length) {
      if (!ast.right || leftType[0] === rightType) {
        return {
          diagnostics,
          type: leftType[1]
        };
      }
      if (typeEq(leftType, rightType)) {
        diagnostics.push('Incorrect type of application!');
        return {
          diagnostics
        };
      }
    } else {
      return { diagnostics };
    }
  }
  return { diagnostics };
};

module.exports.Check = ast => Check(ast);

