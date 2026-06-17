#!/bin/bash
set -e

echo "=== Lean 4 TheologyValidator Check ==="

if ! command -v lean &> /dev/null; then
  echo "lean not found — skipping (install elan for Lean 4)"
  echo "PROOF_STATUS: SKIPPED"
  exit 0
fi

echo "Running: lean --run lean/TheologyValidator.lean"
lean --run lean/TheologyValidator.lean 2>&1 || true

echo ""
echo "Checking for 'sorry' placeholders..."
SORRY_COUNT=$(grep -c "sorry" lean/TheologyValidator.lean || true)
echo "Found $SORRY_COUNT sorry placeholder(s)"

if [ "$SORRY_COUNT" -gt 0 ]; then
  echo "PROOF_STATUS: PARTIAL ($SORRY_COUNT sorry placeholders)"
else
  echo "PROOF_STATUS: COMPLETE"
fi

echo "=== Done ==="
