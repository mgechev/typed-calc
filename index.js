const { parse } = require('./simply-typed');
const { Check } = require('./check');
const { Eval } = require('./eval');

const ast1 = parse('(λ a: Int → a) if (λ a: Int → iszero a) pred 0 then succ 0 else 0');
const ast2 = parse('(λ a: Bool → succ succ 0) iszero 0');

console.log(Check(ast1));
console.log(Check(ast2));

console.log(Eval(ast1));
console.log(Eval(ast2));

