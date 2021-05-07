import { MarkdownView } from './MarkdownView';
import { JsonView } from './JsonView';

export const textResolvers = {
  markdown: MarkdownView,
  html: MarkdownView,
  plain: JsonView,
  javascript: JsonView,
};
