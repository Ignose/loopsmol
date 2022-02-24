import { use, visitUrl } from "kolmafia";
import {
  $effect,
  $effects,
  $item,
  $items,
  $location,
  $monster,
  $skill,
  get,
  have,
  Macro,
} from "libram";
import { OutfitSpec, Quest, step } from "./structure";
import { CombatStrategy } from "../combat";
import { atLevel } from "../lib";

export const KnobQuest: Quest = {
  name: "Knob",
  tasks: [
    {
      name: "Start",
      after: [],
      ready: () => atLevel(5),
      completed: () => step("questL05Goblin") >= 0,
      do: () => visitUrl("council.php"),
      limit: { tries: 1 },
      freeaction: true,
    },
    {
      name: "Outskirts",
      after: [],
      completed: () => have($item`Knob Goblin encryption key`) || step("questL05Goblin") > 0,
      do: $location`The Outskirts of Cobb's Knob`,
      choices: { 111: 3, 113: 2, 118: 1 },
      limit: { tries: 11 },
      delay: 10,
    },
    {
      name: "Open Knob",
      after: ["Start", "Outskirts"],
      completed: () => step("questL05Goblin") >= 1,
      do: () => use($item`Cobb's Knob map`),
      limit: { tries: 1 },
      freeaction: true,
    },
    {
      name: "Harem",
      after: ["Open Knob"],
      completed: () => have($item`Knob Goblin harem veil`) && have($item`Knob Goblin harem pants`),
      do: $location`Cobb's Knob Harem`,
      outfit: (): OutfitSpec => {
        if (
          have($item`industrial fire extinguisher`) &&
          get("_fireExtinguisherCharge") >= 20 &&
          !get("fireExtinguisherHaremUsed")
        )
          return {
            equip: $items`industrial fire extinguisher`,
          };
        else return {};
      },
      combat: new CombatStrategy()
        .macro(new Macro().trySkill($skill`Fire Extinguisher: Zone Specific`))
        .banish($monster`Knob Goblin Harem Guard`)
        .killItem(),
      limit: { tries: 1 },
    },
    {
      name: "Perfume",
      after: ["Harem"],
      completed: () => have($effect`Knob Goblin Perfume`) || have($item`Knob Goblin perfume`),
      do: $location`Cobb's Knob Harem`,
      outfit: { equip: $items`Knob Goblin harem veil, Knob Goblin harem pants` },
      limit: { tries: 1 },
    },
    {
      name: "King",
      after: ["Perfume"],
      priority: () => have($effect`Knob Goblin Perfume`),
      completed: () => step("questL05Goblin") === 999,
      do: $location`Throne Room`,
      combat: new CombatStrategy(true).kill($monster`Knob Goblin King`),
      outfit: { equip: $items`Knob Goblin harem veil, Knob Goblin harem pants` },
      effects: $effects`Knob Goblin Perfume`,
      limit: { tries: 1 },
    },
  ],
};
