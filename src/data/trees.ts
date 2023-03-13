import { SkillNode } from "../entities/skilltree/node.entity";

export const Trees = {
  water: [{ id: "water-1" }, { id: "water-2" }],
};

export interface Tree {
  prefix: string;
  colors: any;
  nodes: SkillNode[];
}
