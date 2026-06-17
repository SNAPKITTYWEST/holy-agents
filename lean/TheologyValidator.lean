inductive Verdict where
  | approve
  | reject
  | repent
deriving Repr, DecidableEq

structure Action where
  truthful : Bool
  harmful : Bool
  exploitative : Bool
  requiresConsent : Bool
  hasConsent : Bool
  witnessed : Bool
  cited : Bool
deriving Repr

def lawful (a : Action) : Bool :=
  a.truthful &&
  !a.harmful &&
  !a.exploitative &&
  (!a.requiresConsent || a.hasConsent) &&
  a.witnessed &&
  a.cited

def judge (a : Action) : Verdict :=
  if lawful a then Verdict.approve else Verdict.repent

theorem approved_is_lawful (a : Action) :
  judge a = Verdict.approve → lawful a = true := by
  intro h
  unfold judge at h
  by_cases hl : lawful a = true
  · exact hl
  · simp [hl] at h

theorem repent_implies_not_lawful (a : Action) :
  judge a = Verdict.repent → lawful a = false := by
  intro h
  unfold judge at h
  by_cases hl : lawful a = true
  · simp [hl] at h
  · rfl

def allActions : List Action := [
  { truthful := true, harmful := false, exploitative := false, requiresConsent := false, hasConsent := false, witnessed := true, cited := true },
  { truthful := false, harmful := false, exploitative := false, requiresConsent := false, hasConsent := false, witnessed := true, cited := true },
  { truthful := true, harmful := true, exploitative := false, requiresConsent := false, hasConsent := false, witnessed := true, cited := true }
]

theorem example_approve : judge (allActions[0]!) = Verdict.approve := by native_decide
theorem example_repent_truth : judge (allActions[1]!) = Verdict.repent := by native_decide
theorem example_repent_harm : judge (allActions[2]!) = Verdict.repent := by native_decide
