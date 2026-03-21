import { type StructureBuilder } from "sanity/structure";
import { capitalize } from "../utils/utils";

import { DOCUMENTS } from "../config";
const SINGLETONS = new Set(DOCUMENTS.map((s) => s.id));

/** List of actions available on singleton documents */
export const SINGLETON_ACTIONS = new Set(["publish", "discardChanges", "restore"]);

/** Helper to filter out singleton document actions */
export const singletonDocumentActions = (input: any[], context: any) =>
  SINGLETONS.has(context.schemaType)
    ? input.filter(({ action }) => action && SINGLETON_ACTIONS.has(action))
    : input;

/** Helper to filter out singleton templates */
export const filterSingletonTemplates = (templates: any[]) =>
  templates.filter(({ schemaType }) => !SINGLETONS.has(schemaType));

/** Structure API helper to create a singleton list item without translation support */
export const Singleton = (
  S: StructureBuilder,
  options: { type: string; id?: string; title?: string; icon?: any }
) => {
  const { type, id = type, title, icon } = options;
  return S.listItem()
    .title(title || capitalize(type))
    .id(id)
    .child(S.document().schemaType(type).documentId(type))
    .icon(icon);
};
