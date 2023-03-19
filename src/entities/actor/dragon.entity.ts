import { SkillNode } from "../skilltree/node.entity";
import { clone, each, find, isUndefined, times } from "lodash-es";
import { ABILITIES } from "../abilities/abilities";

export const newDragonFromNodes = (selectedNodes: SkillNode[]) => {
  const baseDragon = {
    movement: 0,
    hp: 0,
    armor: 0,
    abilities: {},
    pointsInvested: 0,
    exportableBuild: {},
  };

  const modifyStat = (
    node: SkillNode,
    stat: string,
    modifier?: number,
    set?: number
  ) => {
    if (!isUndefined(set)) {
      baseDragon[stat] = set;
    } else {
      if (node.levels) {
        const acquired = node.acquired || 0;
        modifier = modifier || 0;

        baseDragon[stat] += modifier * acquired;
      } else {
        baseDragon[stat] += modifier;
      }
    }
  };

  const registerAbility = (id: string, gain?) => {
    const ability = find(ABILITIES, { id: id });

    if (isUndefined(baseDragon.abilities[id])) {
      baseDragon.abilities[id] = clone(ability);
      baseDragon.abilities[id].modifiers = {};
    }

    baseDragon.abilities[id].learned = baseDragon.abilities[id].learned || gain;
  };

  const replaceAbiltiy = (id) => {
    const ability = find(ABILITIES, { id: id });

    if (ability) {
      registerAbility(ability.id);

      baseDragon.abilities[id].replaced = true;
    }
  };

  const registerOrModifyAbility = (id, gain, modifiers = {}, node) => {
    const ability = find(ABILITIES, { id: id });

    registerAbility(id, gain);

    if (ability?.replaces && baseDragon.abilities[id].learned) {
      replaceAbiltiy(ability?.replaces);
    }

    if (modifiers) {
      each(Object.keys(modifiers), (key) => {
        let modifier = modifiers[key];

        if (modifier === "levels") {
          modifier = node.acquired;
        } else if (node.levels) {
          modifier = node.acquired * modifier;
        }

        if (isUndefined(baseDragon.abilities[id].modifiers[key])) {
          baseDragon.abilities[id].modifiers[key] = 0;
        }

        baseDragon.abilities[id].modifiers[key] += modifier;
      });
    }
  };

  each(selectedNodes, (node: SkillNode) => {
    if (node.levels) {
      const acquired = node.acquired || 0;
      baseDragon.exportableBuild[node.id] = node.acquired || 0;
      if (node.levelCost) {
        if (Array.isArray(node.levelCost)) {
          times(acquired, (i) => {
            baseDragon.pointsInvested += (node.levelCost as number[])[i];
          });
        } else {
          baseDragon.pointsInvested += acquired * node.levelCost;
        }
      } else {
        baseDragon.pointsInvested += node.acquired || 0;
      }
    } else {
      baseDragon.exportableBuild[node.id] = true;
      baseDragon.pointsInvested += node.cost || 1;
    }
    if (node.providedStats) {
      each(node.providedStats, (stat) => {
        // console.log(node);
        modifyStat(node, stat.id, stat.modifier, stat.set);
      });
    }

    if (node.providedAbilities) {
      each(node.providedAbilities, (ability) => {
        registerOrModifyAbility(
          ability.id,
          ability.gain,
          ability.modifiers,
          node
        );
      });
    }
  });

  return baseDragon;
};
