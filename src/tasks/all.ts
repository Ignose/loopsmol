import { TootQuest } from "./level1";
import { MosquitoQuest } from "./level2";
import { TavernQuest } from "./level3";
import { BatQuest } from "./level4";
import { KnobQuest } from "./level5";
import { FriarQuest } from "./level6";
import { CryptQuest } from "./level7";
import { McLargeHugeQuest } from "./level8";
import { ChasmQuest } from "./level9";
import { GiantQuest } from "./level10";
import { HiddenQuest } from "./level11_hidden";
import { ManorQuest } from "./level11_manor";
import { PalindomeQuest } from "./level11_palindome";
import { MacguffinQuest } from "./level11";
import { WarQuest } from "./level12";
import { TowerQuest } from "./level13";
import { MiscQuest, WandQuest } from "./misc";
import { DigitalQuest, KeysQuest } from "./keys";
import { SummonQuest } from "./summons";
import { DietQuest } from "./diet";
import { Task } from "../engine/task";
import { getTasks } from "grimoire-kolmafia";
import { args } from "../args";
import { LevelingQuest } from "./leveling";

export function all_tasks(): Task[] {
  const quests = [
    TootQuest,
    MiscQuest,
    LevelingQuest,
    DietQuest,
    WandQuest,
    KeysQuest,
    SummonQuest,
    MosquitoQuest,
    TavernQuest,
    BatQuest,
    KnobQuest,
    FriarQuest,
    // OrganQuest,
    CryptQuest,
    McLargeHugeQuest,
    ChasmQuest,
    GiantQuest,
    HiddenQuest,
    ManorQuest,
    PalindomeQuest,
    MacguffinQuest,
    WarQuest,
    TowerQuest,
    DigitalQuest,
  ];

  const tasks = getTasks(quests);
  for (const task of tasks) {
    if (task.limit.soft) {
      task.limit.soft *= args.minor.luck;
    }
  }
  return tasks;
}
