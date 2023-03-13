import { SkillNode } from "../skilltree/node.entity";
import { clone, each, find, isUndefined } from "lodash-es";
import { ABILITIES, Ability } from "../abilities/abilities";

export const newDragonFromNodes = (selectedNodes: SkillNode[]) => {
  const baseDragon = {
    movement: 5,
    hp: 10,
    armor: 2,
    abilities: {},
    pointsInvested: 0,
  };

  const modifyStat = (stat: string, modifier: number) => {
    baseDragon[stat] += modifier;
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

        if (modifier === "points") {
          modifier = node.committed;
        }

        if (isUndefined(baseDragon.abilities[id].modifiers[key])) {
          baseDragon.abilities[id].modifiers[key] = 0;
        }

        baseDragon.abilities[id].modifiers[key] += modifier;
      });
    }
  };

  each(selectedNodes, (node: SkillNode) => {
    if (node.points) {
      baseDragon.pointsInvested += node.committed || 0;
    } else {
      baseDragon.pointsInvested += node.cost || 1;
    }
    if (node.providedStats) {
      each(node.providedStats, (stat) => {
        modifyStat(stat.id, stat.modifier);
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
