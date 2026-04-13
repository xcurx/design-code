export interface LLDScore {
  structural_validation: number;
  relationship_validation: number;
  design_quality: number;
  design_patterns: number;
  solid_principles: number;
  coupling_cohesion: number;
  architecture_layering: number;
  overall_score: number;
}

export interface LLDImprovement {
  improvement_tips: string[];
}

export interface LLDResponse {
  score: LLDScore;
  description: string;
  improvement: LLDImprovement;
}

export interface LLDRequest {
  diagram: string;
  prompt: string;
}
