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
  Boolean: 'Bool',
  Natural: 'Nat'
}

module.exports.ASTNodes = ASTNodes;
module.exports.Types = Types;
