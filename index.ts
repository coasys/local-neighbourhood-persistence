import type { Address, Language, LanguageContext, ExpressionUI, Interaction } from "https://esm.sh/@perspect3vism/ad4m@0.3.4";
import Adapter from "./adapter.ts";

function interactions(expression: Address): Interaction[] {
  return [];
}

export const name = "neighbourhood-store";

export default async function create(context: LanguageContext): Promise<Language> {
  const expressionAdapter = new Adapter(context);

  return {
    name,
    expressionAdapter,
    interactions,
  } as Language;
}
