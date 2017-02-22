const { parse } = require('./simply-typed');
const { Check } = require('./check');

const ast1 = parse('(λ a: Int → a) if (λ a: Int → iszero a) pred 0 then succ 0 else 0');

const ast2 = parse('(λ a: Int → iszero a) succ 0');
// const ast = parse('(λ a: Int → iszero a) succ 0');

console.log(Check(ast1));
console.log(Check(ast2));

