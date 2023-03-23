export interface SkillNode {
  id: string;
  name: string;
  description?: string;
  requires?: Array<{ id: string; levels?: number }>;
  levelsRequired?: number;
  colors?: {
    selected?: any;
    inactive?: any;
    unavailable?: any;
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
