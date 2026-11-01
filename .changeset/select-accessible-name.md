---
"@lockin90/ui": patch
---

Select: the combobox now has an accessible name — `aria-label` lands on the trigger (and the search input), and a visible `label` names it via aria-labelledby. Before, `aria-label` only reached the wrapper div.
