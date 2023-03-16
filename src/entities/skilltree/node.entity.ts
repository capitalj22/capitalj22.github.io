export interface SkillNode {
  id: string;
  name: string;
  description?: string;
  requires?: string;
  levelsRequired?: number;
  colors?: {
    active?: number;
    inactive?: number;
    unavailable?: number;
  };
  levels?: number;
  levelCost?: number | number[];
  levelsAcquired?: number;
  acquired?: number;
  cost?: number;
  providedAbilities?: Array<{
    id: string;
    gain?: boolean;
    modifiers?: any;
    replaces?: string;
  }>;
  providedStats?: Array<{
    id: string;
    modifier?: number;
    set?: number;
  }>;
}
