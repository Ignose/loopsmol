import {
  cliExecute,
  Item,
  myHash,
  use,
  visitUrl,
} from "kolmafia";
import {
  $effect,
  $effects,
  $familiar,
  $item,
  $items,
  $location,
  $monster,
  $monsters,
  $skill,
  get,
  have,
  Macro,
} from "libram";
import { Quest, Task } from "../engine/task";
import { OutfitSpec, step } from "grimoire-kolmafia";
import { Priorities } from "../engine/priority";
import { CombatStrategy } from "../engine/combat";
import { tryForceNC, tryPlayApriling } from "../engine/resources";

function manualChoice(whichchoice: number, option: number) {
  return visitUrl(`choice.php?whichchoice=${whichchoice}&pwd=${myHash()}&option=${option}`);
}

const Temple: Task[] = [
  {
    name: "Forest Coin",
    after: ["Mosquito/Burn Delay"],
    prepare: () => {
      tryForceNC();
      tryPlayApriling("-combat");
    },
    completed: () =>
      have($item`tree-holed coin`) ||
      have($item`Spooky Temple map`) ||
      step("questM16Temple") === 999,
    do: $location`The Spooky Forest`,
    choices: { 502: 2, 505: 2, 334: 1 },
    outfit: { modifier: "-combat" },
    limit: { soft: 10 },
  },
  {
    name: "Forest Map",
    after: ["Forest Coin"],
    prepare: () => {
      tryForceNC();
      tryPlayApriling("-combat");
    },
    completed: () => have($item`Spooky Temple map`) || step("questM16Temple") === 999,
    do: $location`The Spooky Forest`,
    choices: { 502: 3, 506: 3, 507: 1, 334: 1 },
    outfit: { modifier: "-combat" },
    limit: { soft: 10 },
  },
  {
    name: "Forest Sapling",
    after: ["Mosquito/Burn Delay"],
    prepare: () => {
      tryForceNC();
      tryPlayApriling("-combat");
    },
    completed: () => have($item`spooky sapling`) || step("questM16Temple") === 999,
    do: $location`The Spooky Forest`,
    choices: { 502: 1, 503: 3, 504: 3, 334: 1 },
    outfit: { modifier: "-combat" },
    limit: { soft: 10 },
  },
  {
    name: "Open Temple",
    after: ["Forest Coin", "Forest Map", "Forest Sapling", "Forest Fertilizer"],
    acquire: [{ item: $item`Spooky-Gro fertilizer` }],
    completed: () => step("questM16Temple") === 999,
    do: () => use($item`Spooky Temple map`),
    limit: { tries: 1 },
    freeaction: true,
  },
  {
    name: "Temple Nostril",
    after: ["Open Temple", "Temple Wool"],
    acquire: [{ item: $item`stone wool` }],
    completed: () => have($item`the Nostril of the Serpent`) || step("questL11Worship") >= 3,
    do: $location`The Hidden Temple`,
    choices: { 579: 2, 582: 1 },
    effects: $effects`Stone-Faced`,
    limit: { tries: 1 },
  },
  {
    name: "Open City",
    after: ["Temple Nostril", "Macguffin/Diary"],
    acquire: [{ item: $item`stone wool` }],
    completed: () => step("questL11Worship") >= 3,
    do: () => {
      visitUrl("adventure.php?snarfblat=280");
      manualChoice(582, 2);
      manualChoice(580, 2);
      manualChoice(584, 4);
      manualChoice(580, 1);
      manualChoice(123, 2);
      visitUrl("choice.php");
      cliExecute("dvorak");
      manualChoice(125, 3);
    },
    outfit: { avoid: $items`June cleaver` },
    effects: $effects`Stone-Faced`,
    limit: { tries: 1 },
  },
];

const Apartment: Task[] = [
  {
    name: "Open Apartment",
    after: ["Open City"],
    completed: () => get("hiddenApartmentProgress") >= 1,
    do: $location`An Overgrown Shrine (Northwest)`,
    outfit: {
      equip: $items`antique machete`,
    },
    combat: new CombatStrategy().killHard(),
    choices: { 781: 1 },
    limit: { tries: 4 },
    freecombat: true,
    acquire: [{ item: $item`antique machete` }],
  },
  {
    name: "Apartment Files", // Get the last McClusky files here if needed, as a backup plan
    after: ["Open Apartment", "Office Files"],
    priority: () =>
      have($effect`Once-Cursed`) || have($effect`Twice-Cursed`) || have($effect`Thrice-Cursed`)
        ? Priorities.Effect
        : Priorities.None,
    completed: () =>
      have($item`McClusky file (page 5)`) ||
      have($item`McClusky file (complete)`) ||
      get("hiddenOfficeProgress") >= 7,
    do: $location`The Hidden Apartment Building`,
    combat: new CombatStrategy()
      .killHard($monster`ancient protector spirit (The Hidden Apartment Building)`)
      .kill($monster`pygmy witch accountant`)
      .banish($monster`pygmy janitor`)
      .banish($monster`pygmy witch lawyer`)
      .ignoreNoBanish($monster`pygmy shaman`)
      .ignore(),
    orbtargets: () => {
      if (have($effect`Thrice-Cursed`)) return [$monster`pygmy witch accountant`];
      else return [$monster`pygmy shaman`, $monster`pygmy witch accountant`];
    },
    post: makeCompleteFile,
    outfit: { equip: $items`miniature crystal ball` },
    limit: { soft: 9 },
    choices: { 780: 1 },
  },
  {
    name: "Apartment",
    after: ["Open Apartment", "Apartment Files"], // Wait until after all needed pygmy witch lawyers are done
    priority: () =>
      have($effect`Once-Cursed`) || have($effect`Twice-Cursed`) || have($effect`Thrice-Cursed`)
        ? Priorities.MinorEffect
        : Priorities.None,
    completed: () => get("hiddenApartmentProgress") >= 7,
    do: $location`The Hidden Apartment Building`,
    combat: new CombatStrategy()
      .killHard($monster`ancient protector spirit (The Hidden Apartment Building)`)
      .banish($monster`pygmy janitor`)
      .banish($monsters`pygmy witch lawyer, pygmy witch accountant`)
      .ignoreNoBanish($monster`pygmy shaman`)
      .ignore(),
    orbtargets: () => {
      if (have($effect`Thrice-Cursed`)) return [];
      else return [$monster`pygmy shaman`];
    },
    post: makeCompleteFile,
    outfit: () => {
      if (have($effect`Twice-Cursed`) && $location`The Hidden Apartment Building`.turnsSpent === 8)
        return { equip: $items`candy cane sword cane, miniature crystal ball` };
      return { equip: $items`miniature crystal ball` };
    },
    choices: { 780: 1 },
    limit: { soft: 9 },
  },
  {
    name: "Finish Apartment",
    after: ["Apartment"],
    completed: () => get("hiddenApartmentProgress") >= 8,
    do: $location`An Overgrown Shrine (Northwest)`,
    choices: { 781: 2 },
    limit: { tries: 1 },
    freeaction: true,
  },
];

const Office: Task[] = [
  {
    name: "Open Office",
    after: ["Open City"],
    completed: () => get("hiddenOfficeProgress") >= 1,
    do: $location`An Overgrown Shrine (Northeast)`,
    combat: new CombatStrategy().killHard(),
    outfit: {
      equip: $items`antique machete`,
    },
    choices: { 785: 1 },
    limit: { tries: 4 },
    freecombat: true,
    acquire: [{ item: $item`antique machete` }],
  },
  {
    name: "Office Files",
    after: ["Open Office"],
    completed: () =>
      (have($item`McClusky file (page 1)`) &&
        have($item`McClusky file (page 2)`) &&
        have($item`McClusky file (page 3)`) &&
        have($item`McClusky file (page 4)`) &&
        have($item`McClusky file (page 5)`)) ||
      have($item`McClusky file (complete)`) ||
      get("hiddenOfficeProgress") >= 7 ||
      $location`The Hidden Office Building`.turnsSpent >= 10,
    do: $location`The Hidden Office Building`,
    post: makeCompleteFile,
    combat: new CombatStrategy()
      .kill($monster`pygmy witch accountant`)
      .banish($monster`pygmy janitor`)
      .banish($monsters`pygmy headhunter, pygmy witch lawyer`),
    choices: { 786: 2 },
    limit: { soft: 10 },
  },
  {
    name: "Office Clip",
    after: ["Office Files", "Apartment Files"],
    completed: () =>
      have($item`boring binder clip`) ||
      have($item`McClusky file (complete)`) ||
      get("hiddenOfficeProgress") >= 7,
    do: $location`The Hidden Office Building`,
    post: makeCompleteFile,
    choices: { 786: 2 },
    combat: new CombatStrategy().ignore(),
    limit: { tries: 6 },
  },
  {
    name: "Office Boss",
    after: ["Office Clip"],
    completed: () => get("hiddenOfficeProgress") >= 7,
    do: $location`The Hidden Office Building`,
    post: makeCompleteFile,
    choices: { 786: 1 },
    combat: new CombatStrategy()
      .killHard($monster`ancient protector spirit (The Hidden Office Building)`)
      .ignore()
      .macro(() => {
        const palindome_dudes_done = have(Item.get(7262)) || step("questL11Palindome") >= 3;
        if (
          get("banishedPhyla").includes("beast") &&
          officeBanishesDone() &&
          palindome_dudes_done
        ) {
          return Macro.trySkill($skill`%fn, Release the Patriotic Screech!`);
        }
        return new Macro();
      }),
    outfit: () => {
      const palindome_dudes_done = have(Item.get(7262)) || step("questL11Palindome") >= 3;
      if (get("banishedPhyla").includes("beast") && officeBanishesDone() && palindome_dudes_done)
        return { familiar: $familiar`Patriotic Eagle` };
      return {};
    },
    orbtargets: () => [],
    limit: { soft: 10 },
  },
  {
    name: "Finish Office",
    after: ["Office Boss"],
    completed: () => get("hiddenOfficeProgress") >= 8,
    do: $location`An Overgrown Shrine (Northeast)`,
    choices: { 785: 2 },
    limit: { tries: 1 },
    freeaction: true,
  },
];

const Hospital: Task[] = [
  {
    name: "Open Hospital",
    after: ["Open City"],
    completed: () => get("hiddenHospitalProgress") >= 1,
    do: $location`An Overgrown Shrine (Southwest)`,
    combat: new CombatStrategy().killHard(),
    outfit: {
      equip: $items`antique machete`,
    },
    choices: { 783: 1 },
    limit: { tries: 4 },
    freecombat: true,
    acquire: [{ item: $item`antique machete` }],
  },
  {
    name: "Hospital",
    after: ["Open Hospital"],
    completed: () => get("hiddenHospitalProgress") >= 7,
    do: $location`The Hidden Hospital`,
    combat: new CombatStrategy()
      .startingMacro(Macro.trySkill($skill`%fn, let's pledge allegiance to a Zone`))
      .killHard($monster`ancient protector spirit (The Hidden Hospital)`)
      .kill($monster`pygmy witch surgeon`)
      .banish($monster`pygmy janitor`)
      .banish($monsters`pygmy orderlies, pygmy witch nurse`),
    outfit: () => {
      const result = <OutfitSpec>{
        shirt: have($skill`Torso Awareness`) ? $item`surgical apron` : undefined,
        equip: $items`half-size scalpel, head mirror, surgical mask, bloodied surgical dungarees`,
      };
      if (!have($effect`Citizen of a Zone`) && have($familiar`Patriotic Eagle`)) {
        result.familiar = $familiar`Patriotic Eagle`;
      }
      return result;
    },
    choices: { 784: 1 },
    limit: { soft: 20 },
  },
  {
    name: "Finish Hospital",
    after: ["Hospital"],
    completed: () => get("hiddenHospitalProgress") >= 8,
    do: $location`An Overgrown Shrine (Southwest)`,
    choices: { 783: 2 },
    limit: { tries: 1 },
    freeaction: true,
  },
];

const Bowling: Task[] = [
  {
    name: "Open Bowling",
    after: ["Open City"],
    completed: () => get("hiddenBowlingAlleyProgress") >= 1,
    do: $location`An Overgrown Shrine (Southeast)`,
    outfit: {
      equip: $items`antique machete`,
    },
    choices: { 787: 1 },
    limit: { tries: 4 },
    freecombat: true,
    acquire: [{ item: $item`antique machete` }],
  },
  {
    name: "Bowling",
    after: ["Open Bowling"],
    acquire: [{ item: $item`bowling ball` }],
    completed: () => get("hiddenBowlingAlleyProgress") >= 7,
    do: $location`The Hidden Bowling Alley`,
    combat: new CombatStrategy().killHard(
      $monster`ancient protector spirit (The Hidden Bowling Alley)`
    ),
    choices: { 788: 1 },
    limit: { tries: 5 },
  },
  {
    name: "Finish Bowling",
    after: ["Bowling"],
    completed: () => get("hiddenBowlingAlleyProgress") >= 8,
    do: $location`An Overgrown Shrine (Southeast)`,
    choices: { 787: 2 },
    limit: { tries: 1 },
    freeaction: true,
  },
];

export const HiddenQuest: Quest = {
  name: "Hidden City",
  tasks: [
    ...Temple,
    ...Office,
    ...Apartment,
    ...Hospital,
    ...Bowling,
    {
      name: "Boss",
      after: ["Finish Office", "Finish Apartment", "Finish Hospital", "Finish Bowling"],
      completed: () => step("questL11Worship") === 999,
      do: $location`A Massive Ziggurat`,
      outfit: {
        equip: $items`antique machete`,
      },
      choices: { 791: 1 },
      combat: new CombatStrategy()
        .killHard($monster`dense liana`)
        .killHard($monster`Protector Spectre`),
      limit: { tries: 4 },
      acquire: [{ item: $item`antique machete` }],
      boss: true,
    },
  ],
};

function makeCompleteFile(): void {
  if (
    have($item`McClusky file (page 1)`) &&
    have($item`McClusky file (page 2)`) &&
    have($item`McClusky file (page 3)`) &&
    have($item`McClusky file (page 4)`) &&
    have($item`McClusky file (page 5)`) &&
    have($item`boring binder clip`)
  ) {
    cliExecute("make McClusky file (complete)");
  }
}

function officeBanishesDone(): boolean {
  if (get("hiddenHospitalProgress") < 7) return false;
  if (get("hiddenApartmentProgress") < 7) return false;
  if (get("hiddenBowlingAlleyProgress") < 7) return false;
  return (
    (have($item`McClusky file (page 1)`) &&
      have($item`McClusky file (page 2)`) &&
      have($item`McClusky file (page 3)`) &&
      have($item`McClusky file (page 4)`) &&
      have($item`McClusky file (page 5)`)) ||
    have($item`McClusky file (complete)`) ||
    get("hiddenOfficeProgress") >= 7
  );
}
