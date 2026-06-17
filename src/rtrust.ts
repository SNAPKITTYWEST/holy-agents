import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RTRUSTRule } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let cachedRules: RTRUSTRule[] | null = null;

export function loadRTRUST(): RTRUSTRule[] {
  if (cachedRules) return cachedRules;
  const rtrustPath = path.join(__dirname, '..', '..', 'constitution', 'RTRUST.md');
  try {
    const content = fs.readFileSync(rtrustPath, 'utf-8');
    const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
    if (!jsonMatch) return [];
    cachedRules = JSON.parse(jsonMatch[1]);
    return cachedRules || [];
  } catch {
    console.error('RTRUST: failed to load constitution');
    return [];
  }
}

export function clearRTRUSTCache(): void {
  cachedRules = null;
}

export function getRuleById(rules: RTRUSTRule[], id: string): RTRUSTRule | undefined {
  return rules.find(r => r.rule_id === id);
}

export function getRulesByPrinciple(rules: RTRUSTRule[], principle: string): RTRUSTRule[] {
  return rules.filter(r => r.principle === principle);
}

export function checkActionAgainstRules(
  action: { harmful: boolean; exploitative: boolean; truthful: boolean; requiresConsent?: boolean; hasConsent?: boolean; witnessed?: boolean; cited?: boolean },
  rules: RTRUSTRule[]
): string[] {
  const violated: string[] = [];
  for (const rule of rules) {
    switch (rule.principle) {
      case 'truthfulness':
        if (!action.truthful) violated.push(rule.rule_id);
        break;
      case 'love':
        if (action.harmful) violated.push(rule.rule_id);
        break;
      case 'justice':
        if (action.exploitative) violated.push(rule.rule_id);
        break;
      case 'autonomy':
        if (action.requiresConsent && !action.hasConsent) violated.push(rule.rule_id);
        break;
      case 'accountability':
        if (action.witnessed === false) violated.push(rule.rule_id);
        break;
      case 'attribution':
        if (action.cited === false) violated.push(rule.rule_id);
        break;
    }
  }
  return violated;
}
