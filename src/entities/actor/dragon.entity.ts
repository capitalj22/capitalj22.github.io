import { SkillNode } from "../skilltree/node.entity";
import {
  clone,
  each,
  find,
  isUndefined,
  startsWith,
  times,
  uniq,
} from "lodash-es";

export const newDragonFromNodes = (
  selectedNodes: SkillNode[],
  abilities,
  globalParams
) => {
  let lockedParams = {};

  const build = {
    globalParams: {},
    lockedStats: {},
    stats: {},
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
    if (isUndefined(build.stats[stat])) {
      build.stats[stat] = 0;
    }

    if (
      !build.lockedStats[stat] ||
      (set && modifier && build.lockedStats[stat] < modifier)
    )
      if (set) {
        build.stats[stat] = modifier;
        build.lockedStats[stat] = modifier;
      } else {
        if (node.levels) {
          const acquired = node.acquired || 0;
          modifier = modifier || 0;

          build.stats[stat] += modifier * acquired;
        } else {
          build.stats[stat] += modifier;
        }
      }
  };

  const registerAbility = (id: string, gain?) => {
    const ability = find(abilities, { id: id });

    if (isUndefined(build.abilities[id])) {
      build.abilities[id] = clone(ability) || {};
      build.abilities[id].modifiers = {};
    }

    build.abilities[id].learned = build.abilities[id].learned || gain;
  };

  const replaceAbiltiy = (id) => {
    const ability = find(abilities, { id: id });

    if (ability) {
      registerAbility(ability.id);

      build.abilities[id].replaced = true;
    }
  };

  const registerOrModifyAbility = (id, gain, modifiers = {}, node) => {
    const ability = find(abilities, { id: id });

    registerAbility(id, gain);

    if (ability?.replaces && build.abilities[id].learned) {
      replaceAbiltiy(ability?.replaces);
    }

    if (modifiers) {
      each(modifiers, (modifier: { id: string; modifier: number }) => {
        if (startsWith(modifier.id, "tag-")) {
          if (isUndefined(build.abilities[id].tags)) {
            build.abilities[id].tags = [];
          }
          const tag = modifier.id.substring(4);
          build.abilities[id].tags = uniq([...build.abilities[id].tags, tag]);
        }
        let val = modifier.modifier;
        if (node.levels) {
          val = node.acquired * modifier.modifier;
        }

        if (isUndefined(build.abilities[id].modifiers[modifier.id])) {
          build.abilities[id].modifiers[modifier.id] = 0;
        }

        build.abilities[id].modifiers[modifier.id] += val;
      });
    }
  };

  each(globalParams, (param) => {
    build.globalParams[param.id] = param.value;
  });

  each(selectedNodes, (node) => {
    if (node.globalParams) {
      each(node.globalParams, (param) => {
        if (isUndefined(build.globalParams[param.id])) {
          build.globalParams[param.id] = 0;
        }

        if (param.set) {
          if (
            !lockedParams[param.id] ||
            param.modifier > lockedParams[param.id]
          ) {
            lockedParams[param.id] = param.modifier;
          }
        } else {
          build.globalParams[param.id] += param.modifier;
        }
      });
    }
  });

  each(selectedNodes, (node: SkillNode) => {
    if (node.levels) {
      const acquired = node.acquired || 0;
      build.exportableBuild[node.id] = node.acquired || 0;
      if (node.levelCost) {
        if (Array.isArray(node.levelCost)) {
          times(acquired, (i) => {
            build.pointsInvested += (node.levelCost as number[])[i];
          });
        } else {
          build.pointsInvested += acquired * node.levelCost;
        }
      } else {
        build.pointsInvested += node.acquired || 0;
      }
    } else {
      build.exportableBuild[node.id] = true;
      build.pointsInvested += node.cost || 1;
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

  return build;
};
