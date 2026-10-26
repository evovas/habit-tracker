const pluralRules = new Intl.PluralRules('en-US');

type PluralForms
  = Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };

export const pluralize = (count: number, forms: PluralForms): string => {
  const category = pluralRules.select(count);
  return forms[category] ?? forms.other;
};
