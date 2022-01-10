import { myLevel, visitUrl } from "kolmafia";
import { $item, $items, $location } from "libram";
import { Quest, step } from "./structure";
import { CombatStrategy } from "../combat";

export const McLargeHugeQuest: Quest = {
  name: "McLargeHuge",
  tasks: [
    {
      name: "Start",
      after: [],
      ready: () => myLevel() >= 8,
      completed: () => step("questL08Trapper") !== -1,
      do: () => visitUrl("council.php"),
      cap: 1,
    },
    {
      name: "Ores",
      after: ["Start"],
      acquire: [
        [3, $item`asbestos ore`],
        [3, $item`chrome ore`],
        [3, $item`linoleum ore`],
      ],
      completed: () => step("questL08Trapper") >= 2,
      do: (): void => {
        visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"); // request ore
        visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"); // provide
      },
      cap: 1,
    },
    {
      name: "Climb",
      after: ["Ores"],
      acquire: $items`ninja rope, ninja carabiner, ninja crampons`,
      completed: () => step("questL08Trapper") >= 3,
      do: (): void => {
        visitUrl("place.php?whichplace=mclargehuge&action=cloudypeak");
      },
      modifier: "cold res 5min",
      cap: 1,
    },
    {
      name: "Peak",
      after: ["Climb"],
      completed: () => step("questL08Trapper") >= 5,
      do: $location`Mist-Shrouded Peak`,
      modifier: "cold res 5min",
      combat: new CombatStrategy().kill(),
      cap: 4,
    },
    {
      name: "Finish",
      after: ["Peak"],
      completed: () => step("questL08Trapper") === 999,
      do: () => visitUrl("place.php?whichplace=mclargehuge&action=trappercabin"),
      cap: 1,
    },
  ],
};
