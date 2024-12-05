import { useVuelidate } from "@vuelidate/core";

export default function (rules, state, options = {}) {
  const validator = useVuelidate(rules, state, {
    $autoDirty: true,
    $lazy: true,
    ...options,
  });

  return validator;
}

export const mustBeQuestion = (value) => !value || value.endsWith("?");
