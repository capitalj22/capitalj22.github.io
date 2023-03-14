import { SkillNode } from "../../entities/skilltree/node.entity";

export interface Tree {
  prefix: string;
  colors: any;
  nodes: SkillNode[];
}
