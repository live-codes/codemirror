import { ContextTracker, ExternalTokenizer } from "@lezer/lr";
import {
  insertedSemi,
  BlockComment,
  PreprocessorLine,
  DollarIdent,
  space as spaceToken,
  identifier,
  Number,
  String,
  Rune,
  Bool,
  Nil,
  IncDecOp,
  colon,
  _break,
  _continue,
  _return,
  closeParen as closeParenToken,
  closeBracket,
  closeBrace as closeBraceToken,
} from "./v.parser.terms";

const newline = 10,
  carriageReturn = 13,
  space = 32,
  tab = 9,
  slash = 47,
  star = 42,
  closeParen = 41,
  closeBrace = 125;

export const blockComment = new ExternalTokenizer((input) => {
  if (input.next != slash || input.peek(1) != star) return;
  input.advance();
  input.advance();
  for (let depth = 1; depth > 0 && input.next >= 0; ) {
    if (input.next == slash && input.peek(1) == star) {
      depth++;
      input.advance();
      input.advance();
    } else if (input.next == star && input.peek(1) == slash) {
      depth--;
      input.advance();
      input.advance();
    } else {
      input.advance();
    }
  }
  input.acceptToken(BlockComment);
});

export const semicolon = new ExternalTokenizer(
  (input, stack) => {
    for (let scan = 0, next = input.next; ; ) {
      if (
        (stack.context &&
          (next < 0 ||
            next == newline ||
            next == carriageReturn ||
            (next == slash && input.peek(scan + 1) == slash))) ||
        next == closeParen ||
        next == closeBrace
      )
        input.acceptToken(insertedSemi);
      if (next != space && next != tab) break;
      next = input.peek(++scan);
    }
  },
  { contextual: true },
);

const trackedTokens = new Set([
  identifier,
  Number,
  String,
  Rune,
  Bool,
  Nil,
  IncDecOp,
  colon,
  PreprocessorLine,
  DollarIdent,
  _break,
  _continue,
  _return,
  closeParenToken,
  closeBracket,
  closeBraceToken,
]);

export const trackTokens = new ContextTracker({
  start: false,
  shift: (context, term) => (term == spaceToken ? context : trackedTokens.has(term)),
});
