class Token {
  constructor(type, value) {
    this.type = type;
    this.value = value;
  }
}

class Lexer {
  constructor(sourceText) {
    this.input = sourceText;
    this.index = 0;
    this.rules = [
      { type: "NUMBER", regex: /^[0-9]+/ },
      { type: "ADD", regex: /^\+/ },
      { type: "MULT", regex: /^\*/ },
      { type: "DIV", regex: /^\// },
      { type: "SUB", regex: /^\-/ },
      { type: "LPAREN", regex: /^\(/ },
      { type: "RPAREN", regex: /^\)/ },
      { type: "SPACE", regex: /^\s+/ },
    ];
  }

  tokenize() {
    const tokens = [];

    // FIX 1: Fixed .length typo
    while (this.index < this.input.length) {
      let remaining = this.input.slice(this.index);
      let matched = false;

      for (const tokentype of this.rules) {
        // FIX 2: match against tokentype.regex, not the whole object
        const match = remaining.match(tokentype.regex);
        if (match) {
          const value = match[0];

          if (tokentype.type !== "SPACE") {
            tokens.push(new Token(tokentype.type, value));
          }
          // FIX 1: Fixed .length typo
          this.index = this.index + value.length;
          matched = true;
          break;
        }
      }

      // FIX 3: Moved OUTSIDE the for loop
      if (matched === false) {
        throw new Error(`Unexpected token at index ${this.index}: ${remaining[0]}`);
      }
    }

    tokens.push(new Token("EOF", null));
    return tokens;
  }
}

class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.index = 0;
  }

  // peek method
  sirip() {
    return this.tokens[this.index] || { type: "EOF", value: null };
  }

  // aka consume
  usaren(inaasahangTypo) {
    const currentToken = this.sirip();
    if (currentToken.type === inaasahangTypo) {
      this.index++;
      return currentToken;
    } else {
      throw new Error(`Expected ${inaasahangTypo} but got ${currentToken.type}`);
    }
  }

  // low precedence +/-
  Expresyon() {
    let leftNode = this.Term();
    while (this.sirip().type === "ADD" || this.sirip().type === "SUB") {
      const operatorToken = this.usaren(this.sirip().type);
      const rightNode = this.Term();

      // FIX 5: Use 'left' and 'right' so evalAST can read them
      leftNode = {
        type: "BinaryExpression",
        operator: operatorToken.value,
        left: leftNode,
        right: rightNode,
      };
    }
    return leftNode;
  }

  // medium precedence * and /
  Term() {
    // FIX 4: Changed to leftNode and added return at the bottom
    let leftNode = this.Factor();
    while (this.sirip().type === "MULT" || this.sirip().type === "DIV") {
      const operatorToken = this.usaren(this.sirip().type);
      const rightNode = this.Factor();
      leftNode = {
        type: "BinaryExpression",
        operator: operatorToken.value,
        left: leftNode,
        right: rightNode,
      };
    }
    return leftNode;
  }

  // highest precedence numbers and ()
  Factor() {
    const currentToken = this.sirip();
    if (currentToken.type === "NUMBER") {
      this.usaren("NUMBER");
      return {
        type: "NumericLiteral",
        value: parseFloat(currentToken.value),
      };
    }
    if (currentToken.type === "LPAREN") {
      this.usaren("LPAREN");
      const insideNode = this.Expresyon();
      this.usaren("RPAREN");
      return insideNode;
    }
    throw new Error(`Unexpected Token: ${currentToken.type}`);
  }

  Parse() {
    return this.Expresyon();
  }
}

// recursive descent evaluator
function evalAST(node) {
  if (node.type === "NumericLiteral") {
    return node.value;
  }

  if (node.type === "BinaryExpression") {
    const leftNodeVal = evalAST(node.left);
    const rightNodeVal = evalAST(node.right);

    switch (node.operator) {
      case "+":
        return leftNodeVal + rightNodeVal;
      case "-":
        return leftNodeVal - rightNodeVal;
      case "*":
        return leftNodeVal * rightNodeVal;
      case "/":
        if (rightNodeVal === 0) throw new Error("Division by zero");
        return leftNodeVal / rightNodeVal;
    }
  }
}

// main runner
const input = "5 + 4 * ";

// 1. Tokenize
const lexer = new Lexer(input);
const tokens = lexer.tokenize();
console.log("=== STEP 1: TOKEN STREAM ===");
console.log(tokens);

// 2. Parse to AST
const parser = new Parser(tokens);
const ast = parser.Parse();
console.log("\n=== STEP 2: JSON AST ===");
console.log(JSON.stringify(ast, null, 2));

// 3. Evaluate
const result = evalAST(ast);
console.log("\n=== STEP 3: EVALUATED RESULT ===");
console.log("Result:", result);