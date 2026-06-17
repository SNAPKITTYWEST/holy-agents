import type { TwinAudit, ParallelAuditResult, TwinVerdict } from './types.js';
import { auditSecurity } from './security.js';
import { auditLogic } from './logic.js';
import { auditPerformance } from './performance.js';

export async function runParallelAudit(sourceFiles: { name: string; content: string }[]): Promise<ParallelAuditResult> {
  const [security, logic, performance] = await Promise.all([
    Promise.resolve(auditSecurity(sourceFiles)),
    Promise.resolve(auditLogic()),
    Promise.resolve(auditPerformance(sourceFiles))
  ]);

  const verdicts: TwinVerdict[] = [security.verdict, logic.verdict, performance.verdict];
  const overallVerdict: TwinVerdict = verdicts.includes('fail') ? 'fail' : verdicts.includes('warn') ? 'warn' : 'pass';

  const disagreements: string[] = [];
  if (security.verdict !== logic.verdict) {
    disagreements.push(`security=${security.verdict} vs logic=${logic.verdict}`);
  }
  if (logic.verdict !== performance.verdict) {
    disagreements.push(`logic=${logic.verdict} vs performance=${performance.verdict}`);
  }
  if (security.verdict !== performance.verdict) {
    disagreements.push(`security=${security.verdict} vs performance=${performance.verdict}`);
  }

  return { security, logic, performance, overallVerdict, disagreements };
}
