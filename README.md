# Simply Typed Lambda Calculus

A type checker and interpreter for simply typed lambda calculus written in JavaScript.

# Example

The following program:

```
(λ a: Int → a) if (λ a: Int → iszero a) pred 0 then succ 0 else 0
```

Is correct and evaluates to `0`.

# How to use?

## Interpreter

```
$ node index.js demo/correct1.lambda

0
```

## Transpiler

```
$ node index.js transpile demo/correct1.lambda

(function(a) {
  return a;
})(
  (function(a) {
    return a === 0;
  })(0 - 1)
    ? 0 + 1
    : 0
);
```

# License

MIT

