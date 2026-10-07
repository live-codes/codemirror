import {
  delimitedIndent,
  foldInside,
  foldNodeProp,
  indentNodeProp,
  LanguageSupport,
  LRLanguage,
} from "@codemirror/language";
import { styleTags, tags as t } from "@lezer/highlight";
// eslint-disable-next-line import/no-unresolved
import { parser } from "./v/v.parser";

export const vLanguage = LRLanguage.define({
  name: "v",
  parser: parser.configure({
    props: [
      indentNodeProp.add({
        "Block MatchBody LiteralValue BareLiteralValue": delimitedIndent({ closing: "}" }),
        "Parameters Arguments": delimitedIndent({ closing: ")" }),
        "TypeParams TypeArgs ArrayLiteral": delimitedIndent({ closing: "]" }),
      }),
      foldNodeProp.add({
        "Block MatchBody LiteralValue BareLiteralValue ArrayLiteral StructType": foldInside,
        "Parameters Arguments TypeParams TypeArgs": foldInside,
        StructDecl: foldInside,
        EnumDecl: foldInside,
        InterfaceDecl: foldInside,
      }),
      styleTags({
        "module import": t.moduleKeyword,
        "fn struct enum interface type const": t.definitionKeyword,
        "pub mut": t.modifier,
        "map shared atomic": t.modifier,
        "if else match for in return break continue defer go spawn or unsafe assert lock rlock": t.controlKeyword,
        "DollarIf DollarElse DollarFor": t.controlKeyword,
        as: t.keyword,
        attribute: t.annotation,
        attributePart: t.attributeName,
        DollarIdent: t.macroName,
        PreprocessorLine: t.processingInstruction,
        Bool: t.bool,
        Nil: t.null,
        String: t.string,
        Rune: t.character,
        Number: t.number,
        VariableName: t.variableName,
        DefName: t.definition(t.variableName),
        FieldName: t.propertyName,
        TypeName: t.typeName,
        LabelName: t.labelName,
        "FunctionDecl/DefName": t.function(t.definition(t.variableName)),
        "MethodDecl/FieldName": t.function(t.definition(t.variableName)),
        "MethodElem/FieldName": t.function(t.definition(t.variableName)),
        "TypeSpec/DefName": t.definition(t.typeName),
        "SelectorExpr/FieldName": t.propertyName,
        "CallExpr/VariableName": t.function(t.variableName),
        LineComment: t.lineComment,
        BlockComment: t.blockComment,
        ArithOp: t.arithmeticOperator,
        LogicOp: t.logicOperator,
        BitOp: t.bitwiseOperator,
        CompareOp: t.compareOperator,
        "DerefOp .": t.derefOperator,
        UpdateOp: t.updateOperator,
        IncDecOp: t.updateOperator,
        "= :=": t.definitionOperator,
        "; ,": t.separator,
        "... :": t.punctuation,
        "( )": t.paren,
        "[ ]": t.squareBracket,
        "{ }": t.brace,
      }),
    ],
  }),
  languageData: {
    commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    closeBrackets: { brackets: ["(", "[", "{", "'", '"', "`"] },
    indentOnInput: /^\s*(?:else|\})$/,
  },
});

export function v() {
  return new LanguageSupport(vLanguage);
}
