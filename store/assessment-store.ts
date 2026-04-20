import { create } from "zustand";
import { persist } from "zustand/middleware";

import { type AccessibilityAssessment } from "@/types/accessibility";

type AssessmentDraft = AccessibilityAssessment | null;

interface AssessmentStore {
  draft: AssessmentDraft;
  setDraft: (draft: AssessmentDraft) => void;
}

export const useAssessmentStore = create<AssessmentStore>()(
  persist(
    (set) => ({
      draft: null,
      setDraft: (draft) => set({ draft })
    }),
    {
      name: "bda-assessment-draft"
    }
  )
);
