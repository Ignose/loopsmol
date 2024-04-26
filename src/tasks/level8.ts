import { Item, itemAmount, numericModifier, visitUrl } from "kolmafia";
import {
  $effect,
  $familiar,
  $item,
  $location,
  $monster,
  $skill,
  ensureEffect,
  get,
  have,
  Macro,
} from "libram";
import { Quest } from "../engine/task";
import { step } from "grimoire-kolmafia";
import { Priorities } from "../engine/priority";
import { CombatStrategy } from "../engine/combat";
import { atLevel } from "../lib";
import { councilSafe } from "./level12";
import { coldPlanner } from "../engine/outfit";
import { trainSetAvailable } from "./misc";

export const McLargeHugeQuest: Quest = {
  name: "McLargeHuge",
  tasks: [
    {
      name: "Start",
      after: [],
      ready: () => atLevel(8),
      completed: () => step("questL08Trapper") !== -1,
      do: () => visitUrl("council.php"),
      limit: { tries: 1 },
      priority: () => (councilSafe() ? Priorities.Free : Priorities.BadMood),
      freeaction: true,
    },
    {
      name: "Trapper Request",
      after: ["Start"],
      completed: () => step("questL08Trapper") >= 1,
      do: () => visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"),
      limit: { tries: 1 },
      priority: () => Priorities.Free,
      freeaction: true,
    },
    {
      name: "Ores",
      after: ["Start"],
      acquire: [
        { item: $item`asbestos ore`, num: 3 },
        { item: $item`chrome ore`, num: 3 },
        { item: $item`linoleum ore`, num: 3 },
        { item: $item`goat cheese`, num: 3 },
      ],
      completed: () => step("questL08Trapper") >= 2,
      do: (): void => {
        visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"); // request ore
        visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"); // provide
      },
      limit: { tries: 1 },
      freeaction: true,
    },
    {
      name: "Climb",
      after: ["Trapper Return", "Palindome/Cold Snake"],
      acquire: [
        { item: $item`ninja rope` },
        { item: $item`ninja carabiner` },
        { item: $item`ninja crampons` },
      ],
      completed: () => step("questL08Trapper") >= 3,
      do: (): void => {
        visitUrl("place.php?whichplace=mclargehuge&action=cloudypeak");
      },
      outfit: { modifier: "cold res 5min" },
      limit: { tries: 1 },
    },
    {
      name: "Peak",
      after: ["Climb"],
      completed: () => step("questL08Trapper") >= 5,
      ready: () => coldPlanner.maximumPossible(true) >= 5,
      prepare: () => {
        if (numericModifier("cold resistance") < 5) ensureEffect($effect`Red Door Syndrome`);
        if (numericModifier("cold resistance") < 5)
          throw `Unable to ensure cold res for The Icy Peak`;
      },
      do: $location`Mist-Shrouded Peak`,
      outfit: () => coldPlanner.outfitFor(5, { familiar: $familiar`Patriotic Eagle` }),
      combat: new CombatStrategy().killHard().macro(() => {
        if (!get("banishedPhyla").includes("beast"))
          return Macro.trySkill($skill`%fn, Release the Patriotic Screech!`);
        return new Macro();
      }),
      boss: true,
      limit: { tries: 4 },
    },
    {
      name: "Finish",
      after: ["Peak"],
      completed: () => step("questL08Trapper") === 999,
      do: () => visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"),
      limit: { tries: 1 },
      freeaction: true,
    },
  ],
};

// Get the number of ores needed from non-trainset places
export function oresNeeded(): number {
  if (step("questL08Trapper") >= 2) return 0;
  if (trainSetAvailable()) return 0;
  let ore_needed = 3;
  ore_needed -= Math.min(
    itemAmount($item`asbestos ore`),
    itemAmount($item`chrome ore`),
    itemAmount($item`linoleum ore`)
  );
  if (have($item`Deck of Every Card`) && get("_deckCardsDrawn") === 0) ore_needed--;
  const pulled = new Set<Item>(
    get("_roninStoragePulls")
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => id > 0)
      .map((id) => Item.get(id))
  );
  if (
    !pulled.has($item`asbestos ore`) &&
    !pulled.has($item`chrome ore`) &&
    !pulled.has($item`linoleum ore`)
  )
    ore_needed--;

  if (get("spookyVHSTapeMonster") === $monster`mountain man`) ore_needed -= 2;
  return Math.max(ore_needed, 0);
}
