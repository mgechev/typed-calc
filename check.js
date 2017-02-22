const ASTNodes = {
  Abstraction: 'abstraction',
  Condition: 'conditional_expression',
  Identifier: 'identifier',
  Literal: 'literal',
  Arithmetic: 'arithmetic',
  IsZero: 'is_zero',
  Application: 'application'
};

const Types = {
  Integer: 'Int',
  Boolean: 'Bool'
};

class SymbolTableImpl {
  constructor() {
    this.table = [];
  }
  push(scope) {
    this.table.push(scope);
  }
  lookup(x) {
    for (let i = this.table.length - 1; i >= 0; i -= 1) {
      const type = this.table[i].get(x);
      if (type) {
        return type;
      }
    }
    return undefined;
  }
}

const SymbolTable = new SymbolTableImpl();

class Scope {
  constructor() {
    this.map = {};
  }
  add(x, type) {
    this.map[x] = type;
  }
  get(x) {
    return this.map[x];
  }
}

const Check = ast => {
  if (!ast) {
    return true;
  }
  if (ast.type === ASTNodes.Literal) {
    if (ast.value === 0) {
      return Types.Integer;
    } else if (ast.value === false || ast.value === true) {
      return Types.Boolean;
    } else {
      console.log('Unknown type literal!');
      return false;
    }
  } else if (ast.type === ASTNodes.Identifier) {
    return SymbolTable.lookup(ast.name);
  } else if (ast.type === ASTNodes.Condition) {
    if (!ast.then || !ast.el || !ast.condition) {
      console.log('No condition for if statement');
      return false;
    }
    const condition = Check(ast.condition);
    if (condition !== Types.Boolean) {
      console.log('Incorrect type of condition of condition!');
      return false;
    }
    const thenBranch = Check(ast.then);
    const elseBranch = Check(ast.el);
    if (thenBranch === elseBranch) {
      return thenBranch;
    } else {
      console.log('Incorrect type of then/else branches!');
      return false;
    }
  } else if (ast.type === ASTNodes.Abstraction) {
    const scope = new Scope();
    scope.add(ast.arg.id.name, ast.arg.type);
    SymbolTable.push(scope);
    if (!ast.body) {
      console.log('No body of a function');
      return false;
    }
    const bodyType = Check(ast.body);
    if (!bodyType) {
      console.log('Incorrect type of the body');
      return false;
    }
    return [ast.arg.type, bodyType];
  } else if (ast.type === ASTNodes.IsZero) {
    const bodyType = Check(ast.expression);
    if (bodyType !== Types.Integer) {
      console.log('Incorrect type of IsZero');
      return false;
    }
    return Types.Boolean;
  } else if (ast.type === ASTNodes.Arithmetic) {
    const bodyType = Check(ast.expression);
    if (bodyType !== Types.Integer) {
      console.log(`Incorrect type of ${ast.operation}`);
      return false;
    }
    return Types.Integer;
  } else if (ast.type === ASTNodes.Application) {
    const leftType = Check(ast.left);
    const rightType = Check(ast.right);
    if (leftType.length) {
      if (!ast.right || leftType[0] === rightType) {
        return leftType[1];
      }
      if (leftType !== rightType) {
        console.log('Incorrect type of application!');
        return false;
      }
    } else {
      return false;
    }
  }
  return true;
};

module.exports.Check = ast => !!Check(ast);

