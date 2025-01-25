import {
  copilotPlugin,
  codeiumOtherDocumentsConfig,
  Language,
} from "@valtown/codemirror-codeium";

const EDITOR_API_KEY = "d49954eb-cfba-4992-980f-d8fb37f0e942";

export const codeium = (
  editors: Array<{
    editorId: string;
    getLanguage: () => string;
    getValue: () => string;
  }>,
  mapLanguage: (lang: string) => string
) => [
  codeiumOtherDocumentsConfig.of({
    override: () =>
      editors.map((editor) => {
        const language = editor.getLanguage();
        return {
          absolutePath: `https://livecodes.io/v/${editor.editorId}/${language}`,
          text: editor.getValue(),
          language:
            Language[
              mapLanguage(language).toUpperCase() as keyof typeof Language
            ] || Language.TYPESCRIPT,
          editorLanguage: mapLanguage(language),
        };
      }),
  }),
  copilotPlugin({
    apiKey: EDITOR_API_KEY,
  }),
];
