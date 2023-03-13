export interface SkillNode {
  id: string;
  name: string;
  description?: string;
  requires?: string;
  colors?: {
    active?: number;
    inactive?: number;
    unavailable?: number;
  };
  points?: number;
  committed?: number;
  cost?: number;
  providedAbilities?: Array<{
    id: string;
    gain?: boolean;
    modifiers?: any;
    replaces?: string;
  }>;
  providedStats?: Array<{
    id: string;
    modifier: number;
  }>;
}
