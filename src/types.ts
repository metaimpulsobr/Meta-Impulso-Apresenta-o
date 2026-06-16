export interface Slide {
  id: number;
  title: string;
  subtitle?: string;
  impactPhrase?: string;
  content?: string[];
  bullets?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  visualType: 'cover' | 'about' | 'problem' | 'solution' | 'list' | 'process' | 'results' | 'reasons' | 'cases' | 'cta' | 'footer' | 'ia' | 'crm';
  benefits?: string[];
  ctaText?: string;
  speakerNotes?: string[];
}

export interface CaseStudy {
  id: string;
  name: string;
  category: string;
  metrics: { label: string; value: string; description: string }[];
  description: string;
  tags: string[];
  resultsText: string;
}
