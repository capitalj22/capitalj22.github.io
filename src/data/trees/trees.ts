import { concat, map, reduce } from "lodash-es";
import { SkillNode } from "../../entities/skilltree/node.entity";
import { AQUATIC_TREE } from "./aquatic.tree";
import { ARMOR_TREE } from "./armor.tree";
import { ATTACK_TREE } from "./attack.tree";
import { BASIC_TREE } from "./basic.tree";
import { FLYING_TREE } from "./flying.tree";
import { BASIC_MAGIC_TREE } from "./magic/basic-magic.tree";
import { HOLY_TREE } from "./magic/holy.tree";
import { MOVEMENT_TREE } from "./movement.tree";

export interface Tree {
  prefix: string;
  colors: any;
  nodes: SkillNode[];
}

export const TREES = reduce(
  [
    BASIC_TREE,
    MOVEMENT_TREE,
    FLYING_TREE,
    ATTACK_TREE,
    ARMOR_TREE,
    BASIC_MAGIC_TREE,
    HOLY_TREE,
    AQUATIC_TREE
  ],
  (nodes, tree) =>
    concat(
      nodes,
      map(tree.nodes, (n) => ({
        ...n,
        colors: tree.colors,
      }))
    ) as any,
  []
);