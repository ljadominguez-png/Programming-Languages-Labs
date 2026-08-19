//Hands-on Lab Objectives
/*
1. Write  a Custom Lexer class using RegEx 
patterns to output typed token Streams. (Class Leer)
    (what does a lexer do)
    1. Removes whitspaces
    2. Source Tracking 
    3. Symbol Binding
    ex.
    let blyat = 1.2 + 1.8;

    =======output=======
    KEYWORD("let")
    IDENTIFIER("blyat")
    ASSIGN("=")
    NUMBER("1.2")
    ADD("+")
    NUMBER("1.8")
    SEMICOLON(";")


2. Write a hand - crafted parser using Recursive Descent to build a valid JSON AST 
    (Class parse_factor, na may helper ayon sa module)
    complexities:
    Recursive Descent
    then the boss
    valid Json AST (howwwww)

    ito yong nakikita sa AST explorer mga bin binladen na yan

3. Traverse the generated AST to evaluate arithmethic Expression (maybe ito na yong output?)
 - arithmetic expression is a math phrase made of 
 numbers and basic signs like plus, minus, times, and divide

    yong output dito naka depende sa step 2 yong recursive descent saka valid json
*/

// before i code i need to understand first what is being asked
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

    while (this.index < this.input.length) {
      let remaining = this.input.slice(this.index);
      let matched = false;

      for (const tokentype of this.rules) {
        const match = remaining.match(tokentype.regex);
        if (match) {
          const value = match[0];

          if (tokentype.type !== "SPACE") {
            tokens.push(new Token(tokentype.type, value));
          }
          // bwakanang shyt yong length naging lenght
          this.index = this.index + value.length;
          matched = true;
          break;
        }
      }
      if (matched === false) {
        throw new Error("EOF");
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
  //peek method
  sirip() {
    return this.tokens[this.index];
  }
  //aka consume
  usaren(inaasahangTypo) {
    const currentToken = this.sirip();
    if (currentToken.type === inaasahangTypo) {
      this.index++;
      return currentToken;
    } else {
      throw new Error("Invalid ka jud");
    }
  }
  //low precedence +/-
  Expresyon() {
    let leftNode = this.Term();
    while (this.sirip().type === "ADD" || this.sirip().type === "SUB") {
      const operatorToken = this.usaren(this.sirip().type);
      const rightNode = this.Term();

      leftNode = {
        type: "BinaryExpression",
        operator: operatorToken.value,
        left: leftNode,
        right: rightNode,
      };
    }
    return leftNode;
  }
  //medium precedence * and /
  Term() {
    // let rightNode = this.Factor();
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

  //highest precedence numbers and ()
  // yong parse_factor na nakalagay sa pdf na sinend ni sir!
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
    throw new Error("Unexpected Token!");
  }
  Parse() {
    const ast = this.Expresyon();
    return ast;
  }
}
//ito na yong recursive descend
function evalAST(node) {
  //pag number ang nauna
  if (node.type === "NumericLiteral") {
    return node.value;
  }
  //if mga operators na BinaryExpression
  if (node.type === "BinaryExpression") {
    //keep looking for the value from the left and right leaf
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
        if (rightNodeVal == 0) throw new Error("");
        return leftNodeVal / rightNodeVal;
    }
  }
}

//main runner (talaga sa baba)
const input = "100 / 2 / 2";
// 1. Tokenize
const lexer = new Lexer(input);
const tokens = lexer.tokenize();
console.log(tokens);

// 2. Parse to AST
const parser = new Parser(tokens);
const ast = parser.Parse();
console.log(JSON.stringify(ast, null, 2));

// 3. Evaluate
const result = evalAST(ast);
console.log("Result:", result);
//input
//tokens
//ast

// dislplay
