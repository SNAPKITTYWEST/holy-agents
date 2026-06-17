import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { RTRUSTRule } from './types.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function loadRTRUST(): RTRUSTRule[] {
  const rtrustPath = path.join(__dirname, '..', '..', 'constitution', 'RTRUST.md');
  const content = fs.readFileSync(rtrustPath, 'utf-8');
  const jsonMatch = content.match(/```json\s*([\s\S]*?)```/);
  if (!jsonMatch) return [];
  return JSON.parse(jsonMatch[1]);
}

export function getRuleById(rules: RTRUSTRule[], id: string): RTRUSTRule | undefined {
  return rules.find(r => r.rule_id === id);
}

export function getRulesByPrinciple(rules: RTRUSTRule[], principle: string): RTRUSTRule[] {
  return rules.filter(r => r.principle === principle);
}

export function checkActionAgainstRules(action: { harmful: boolean; exploitative: boolean; truthful: boolean }, rules: RTRUSTRule[]): string[] {
  const violated: string[] = [];
  for (const rule of rules) {
    if (rule.principle === 'truthfulness' && !action.truthful) violated.push(rule.rule_id);
    if (rule.principle === 'love' && action.harmful) violated.push(rule.rule_id);
    if (rule.principle === 'justice' && action.exploitative) violated.push(rule.rule_id);
  }
  return violated;
}
