import { SkillNode } from "../skilltree/node.entity";
import { clone, each, find, isUndefined, times } from "lodash-es";

export const newDragonFromNodes = (selectedNodes: SkillNode[], abilities) => {
  const baseDragon = {
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
    if (isUndefined(baseDragon[stat])) {
      baseDragon[stat] = 0;
    }
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
    const ability = find(abilities, { id: id });

    if (isUndefined(baseDragon.abilities[id])) {
      baseDragon.abilities[id] = clone(ability) || {};
      baseDragon.abilities[id].modifiers = {};
    }

    baseDragon.abilities[id].learned = baseDragon.abilities[id].learned || gain;
  };

  const replaceAbiltiy = (id) => {
    const ability = find(abilities, { id: id });

    if (ability) {
      registerAbility(ability.id);

      baseDragon.abilities[id].replaced = true;
    }
  };

  const registerOrModifyAbility = (id, gain, modifiers = {}, node) => {
    const ability = find(abilities, { id: id });

    registerAbility(id, gain);

    if (ability?.replaces && baseDragon.abilities[id].learned) {
      replaceAbiltiy(ability?.replaces);
    }

    if (modifiers) {
      each(modifiers, (modifier: { id: string; modifier: number }) => {
        let val = modifier.modifier;
        if (node.levels) {
          val = node.acquired * modifier.modifier;
        }

        if (isUndefined(baseDragon.abilities[id].modifiers[modifier.id])) {
          baseDragon.abilities[id].modifiers[modifier.id] = 0;
        }

        baseDragon.abilities[id].modifiers[modifier.id] += val;
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
