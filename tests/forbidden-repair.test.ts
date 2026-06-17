import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { FORBIDDEN_ACTIONS, checkForbidden } from '../src/validation.js';

describe('FORBIDDEN_ACTIONS repair — RTRUST-006 completeness', () => {
  it('includes unmerciful_judgment', () => {
    assert.ok(FORBIDDEN_ACTIONS.includes('unmerciful_judgment'));
  });

  it('includes cruelty', () => {
    assert.ok(FORBIDDEN_ACTIONS.includes('cruelty'));
  });

  it('includes vengeance', () => {
    assert.ok(FORBIDDEN_ACTIONS.includes('vengeance'));
  });

  it('checkForbidden detects cruelty', () => {
    assert.equal(checkForbidden('cruelty'), true);
  });

  it('checkForbidden detects vengeance', () => {
    assert.equal(checkForbidden('vengeance'), true);
  });

  it('total forbidden actions is 24', () => {
    assert.equal(FORBIDDEN_ACTIONS.length, 24);
  });
});
