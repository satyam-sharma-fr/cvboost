import { create } from 'zustand'
import type { CVCreationState, TemplateStyle } from '@/types'

interface CVCreationStore extends CVCreationState {
  setStep: (step: number) => void
  nextStep: () => void
  prevStep: () => void
  setUploadedFile: (file: File | null) => void
  setExtractedText: (text: string) => void
  setJobDetails: (details: Partial<Pick<CVCreationState, 'jobTitle' | 'jobCompany' | 'jobDescription' | 'jobUrl'>>) => void
  setPreferences: (prefs: Partial<Pick<CVCreationState, 'templateStyle' | 'isAnonymous' | 'hasAIAvatar' | 'avatarGender' | 'language'>>) => void
  reset: () => void
}

const initialState: CVCreationState = {
  step: 1,
  uploadedFile: null,
  extractedText: '',
  jobTitle: '',
  jobCompany: '',
  jobDescription: '',
  jobUrl: '',
  templateStyle: 'professional' as TemplateStyle,
  isAnonymous: false,
  hasAIAvatar: false,
  avatarGender: 'neutral',
  language: 'en',
}

export const useCVCreationStore = create<CVCreationStore>((set) => ({
  ...initialState,
  
  setStep: (step) => set({ step }),
  
  nextStep: () => set((state) => ({ step: Math.min(state.step + 1, 5) })),
  
  prevStep: () => set((state) => ({ step: Math.max(state.step - 1, 1) })),
  
  setUploadedFile: (file) => set({ uploadedFile: file }),
  
  setExtractedText: (text) => set({ extractedText: text }),
  
  setJobDetails: (details) => set((state) => ({ ...state, ...details })),
  
  setPreferences: (prefs) => set((state) => ({ ...state, ...prefs })),
  
  reset: () => set(initialState),
}))


