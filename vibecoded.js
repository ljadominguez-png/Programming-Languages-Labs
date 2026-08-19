// ==========================================
// 1. TOKEN DEFINITIONS & LEXER
// ==========================================
class Token {
  constructor(type, value, line, col) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.col = col;
  }
}

class Lexer {
  constructor(source) {
    this.source = source;
    this.cursor = 0;
    this.line = 1;
    this.col = 1;

    // Ordered token specification
    this.tokenSpecs = [
      { type: "NUMBER", regex: /^[0-9]+(\.[0-9]+)?/ },
      { type: "IDENTIFIER", regex: /^[a-zA-Z_][a-zA-Z0-9_]*/ },
      { type: "PLUS", regex: /^\+/ },
      { type: "MINUS", regex: /^-/ },
      { type: "MULT", regex: /^\*/ },
      { type: "DIV", regex: /^\// },
      { type: "LPAREN", regex: /^\(/ },
      { type: "RPAREN", regex: /^\)/ },
      { type: "ASSIGN", regex: /^=/ },
      { type: "WHITESPACE", regex: /^\s+/ },
    ];
  }

  tokenize() {
    const tokens = [];

    while (this.cursor < this.source.length) {
      const remaining = this.source.slice(this.cursor);
      let matched = false;

      for (const { type, regex } of this.tokenSpecs) {
        const match = remaining.match(regex);
        if (match) {
          const value = match[0];

          // Track newlines for line/col counting
          const newlines = (value.match(/\n/g) || []).length;
          
          if (type !== "WHITESPACE") {
            tokens.push(new Token(type, value, this.line, this.col));
          }

          this.cursor += value.length;
          if (newlines > 0) {
            this.line += newlines;
            this.col = value.length - value.lastIndexOf("\n");
          } else {
            this.col += value.length;
          }

          matched = true;
          break;
        }
      }

      if (!matched) {
        throw new Error(
          `Lexer Error: Unrecognized character '${this.source[this.cursor]}' at Line ${this.line}, Col ${this.col}`
        );
      }
    }

    tokens.push(new Token("EOF", null, this.line, this.col));
    return tokens;
  }
}

// ==========================================
// 2. RECURSIVE DESCENT PARSER (JSON AST)
// ==========================================
class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
  }

  peek() {
    return this.tokens[this.index];
  }

  consume(expectedType) {
    const token = this.peek();
    if (token.type !== expectedType) {
      throw new Error(
        `Parse Error: Expected '${expectedType}' but received '${token.type}' (${token.value}) at Line ${token.line}, Col ${token.col}`
      );
    }
    this.index++;
    return token;
  }

  parse() {
    const ast = this.parseExpression();
    this.consume("EOF");
    return ast;
  }

  // Expression -> Term ( ('+' | '-') Term )*
  parseExpression() {
    let leftNode = this.parseTerm();

    while (this.peek().type === "PLUS" || this.peek().type === "MINUS") {
      const opToken = this.consume(this.peek().type);
      const rightNode = this.parseTerm();
      leftNode = {
        type: "BinaryExpression",
        operator: opToken.value,
        left: leftNode,
        right: rightNode,
      };
    }
    return leftNode;
  }

  // Term -> Factor ( ('*' | '/') Factor )*
  parseTerm() {
    let leftNode = this.parseFactor();

    while (this.peek().type === "MULT" || this.peek().type === "DIV") {
      const opToken = this.consume(this.peek().type);
      const rightNode = this.parseFactor();
      leftNode = {
        type: "BinaryExpression",
        operator: opToken.value,
        left: leftNode,
        right: rightNode,
      };
    }
    return leftNode;
  }

  // Factor -> NUMBER | IDENTIFIER | '(' Expression ')'
  parseFactor() {
    const token = this.peek();

    if (token.type === "NUMBER") {
      this.consume("NUMBER");
      return {
        type: "NumericLiteral",
        value: parseFloat(token.value),
      };
    }

    if (token.type === "IDENTIFIER") {
      this.consume("IDENTIFIER");
      return {
        type: "Identifier",
        name: token.value,
      };
    }

    if (token.type === "LPAREN") {
      this.consume("LPAREN");
      const expressionNode = this.parseExpression();
      this.consume("RPAREN");
      return expressionNode;
    }

    throw new Error(
      `Parse Error: Unexpected token '${token.type}' (${token.value}) at Line ${token.line}, Col ${token.col}`
    );
  }
}

// ==========================================
// 3. TREE-WALKING AST EVALUATOR
// ==========================================
class Evaluator {
  constructor(environment = {}) {
    this.env = environment;
  }

  evaluate(node) {
    switch (node.type) {
      case "NumericLiteral":
        return node.value;

      case "Identifier":
        if (!(node.name in this.env)) {
          throw new Error(`Evaluation Error: Undefined variable '${node.name}'`);
        }
        return this.env[node.name];

      case "BinaryExpression": {
        const leftVal = this.evaluate(node.left);
        const rightVal = this.evaluate(node.right);

        switch (node.operator) {
          case "+": return leftVal + rightVal;
          case "-": return leftVal - rightVal;
          case "*": return leftVal * rightVal;
          case "/":
            if (rightVal === 0) throw new Error("Evaluation Error: Division by zero");
            return leftVal / rightVal;
          default:
            throw new Error(`Evaluation Error: Unsupported operator '${node.operator}'`);
        }
      }

      default:
        throw new Error(`Evaluation Error: Unknown node type '${node.type}'`);
    }
  }
}

// ==========================================
// DEMO / TEST RUN
// ==========================================
const sourceCode = "5 +  4 * 8";
const variableScope = { basePrice: 15 };

console.log("Input Expression:", sourceCode);

// 1. Lexing
const lexer = new Lexer(sourceCode);
const tokens = lexer.tokenize();
console.log("\n--- Token Stream ---");
console.log(tokens);

// 2. Parsing
const parser = new Parser(tokens);
const ast = parser.parse();
console.log("\n--- Generated JSON AST ---");
console.log(JSON.stringify(ast, null, 2));

// 3. AST Evaluation
const evaluator = new Evaluator(variableScope);
const result = evaluator.evaluate(ast);
console.log("\n--- Evaluator Output ---");
console.log(`Evaluated Result with { basePrice: 15 }: ${result}`);