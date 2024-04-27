import { orderByRoute } from "grimoire-kolmafia";
import { Task } from "./engine/task";

export const ROUTE_WAIT_TO_NCFORCE = 30;

export const routing: string[] = [
  "Diet/Numberology", // Numberology is always ready at the start of the day
  "Diet/Sausage", // Eat magical sausages as soon as they are obtained
  "Diet/Hourglass",

  // Pickup items
  "Misc/Floundry",
  "Misc/Voting",
  "Misc/Acquire Kgnee",

  // Break pvp stone ASAP
  "Misc/Break Stone",

  // Start with the basic leveling tasks
  "Toot/Finish",
  "Leveling/Cloud Talk",
  "Leveling/Daycare",
  "Leveling/Bastille",
  "Leveling/Leaflet",
  "Leveling/Snojo",
  "Leveling/Chateau",

  // Then do the scaling leveling
  "Leveling/LOV Tunnel",
  "Leveling/Witchess",
  "Leveling/God Lobster",
  "Leveling/Machine Elf",
  "Leveling/Neverending Party",
  "Diet/Consume",
  "Misc/Protonic Ghost", // whenever ghosts are ready

  // Open up MacGuffin zones
  "Macguffin/Diary",
  "Macguffin/Desert", // charge camel, use voters

  // Get basic gear
  "Misc/Workshed",
  "Misc/Goose Exp",
  "Misc/Acquire Birch Battery",
  "Keys/Deck",

  // Start quests when able
  "Knob/Start",
  "McLargeHuge/Trapper Request",
  "McLargeHuge/Ores",
  "Knob/Outskirts",
  "Knob/Open Knob",

  // Unlock island to start YRing
  "Misc/Unlock Island Submarine",
  "Misc/Unlock Island",

  // Grind tasks until level 11
  "Bat/Use Sonar If Cheap",
  "Manor/Kitchen",
  "Mosquito/Burn Delay",
  "Macguffin/Compass", // Unlock desert for ultrahydrated use

  // First -combat group
  "War/Enrage", // Open the War ASAP for Yellow rays
  "War/Flyers Start", // Start the war and get flyers
  "War/Flyers End", // End the flyers quest ASAP in case of tracking errors
  "Hidden City/Forest Coin", // First to get meat
  "Hidden City/Forest Map",
  // "Hidden City/Forest Fertilizer", // Just buy this
  "Hidden City/Forest Sapling", // Last to sell bar skins
  "Manor/Billiards",
  "Friar/Finish",

  // Open delay
  "Manor/Start Floor2",
  "Palindome/Copperhead",

  // Do summons when ready
  "Summon/Astrologer Of Shub-Jigguwatt",
  "Summon/Astronomer",
  "Summon/Camel's Toe",
  "Summon/Baa'baa'bu'ran",

  // Start Hidden city
  "Hidden City/Open Temple",
  "Hidden City/Open City",
  "Hidden City/Open Bowling",
  "Hidden City/Open Office",
  "Hidden City/Open Hospital",
  "Hidden City/Open Apartment",

  // Setup additional -combats
  "Manor/Bedroom",
  "Palindome/Bat Snake",
  "Giant/Grow Beanstalk",
  "Bat/Use Sonar 3", // Reveal more delay
  "Palindome/Cold Snake",
  "McLargeHuge/Climb",

  // Get and use clovers
  "Misc/Hermit Clover",
  "Palindome/Protesters",

  // Second -combat group
  "Mosquito/Finish",
  "Crypt/Cranny",
  "Giant/Basement Finish",
  "Giant/Unlock HITS",

  // The following 3 tasks should always stay in this order
  "Macguffin/Oasis", // Get ultrahydrated as soon as needed
  "Macguffin/Oasis Drum", // Get drum as soon as pages are gathered
  "Macguffin/Desert", // charge camel for protestors

  // Finish remaining quests
  "Crypt/Alcove",

  // Hidden City
  "Hidden City/Office Files", // Banish janitors under delay
  "Hidden City/Apartment",
  "Hidden City/Hospital",
  "Hidden City/Bowling",

  "Manor/Boss",
  "McLargeHuge/Finish", // Get Eagle beast banish
  "Giant/Finish",
  "Palindome/Talisman",
  "Palindome/Palindome Dudes", // Use Eagle beast banish
  "Crypt/Niche",
  "War/Junkyard End",

  "Tavern/Finish",

  // Setup for +meat/+item set
  "Digital/Vanya",
  "Digital/Megalo",
  "Hidden City/Office Boss", // Get Eagle dude banish
  "Macguffin/Upper Chamber",
  "Orc Chasm/Start Peaks",
  "Orc Chasm/ABoo Carto",
  "War/Open Nuns",

  // Bulk +meat/+item tasks
  "Misc/Shadow Rift",
  "Misc/Shadow Lodestone",
  "War/Nuns",
  "Crypt/Nook",
  "Orc Chasm/ABoo Clues",
  "Digital/Hero",
  "Macguffin/Middle Chamber", // Avoid Eagle beast banish!
  "Orc Chasm/Twin Init Search",
  "Orc Chasm/Twin Init", // Use Eagle dude banish
  "Digital/Key",

  "Keys/Star Key", // Allow for better use of orb
  "Macguffin/Finish",
  "Crypt/Finish",
  "War/Boss Hippie",
  "Orc Chasm/Finish",

  // Finish up with last delay
  "Bat/Finish",
  "Misc/Eldritch Tentacle",
  "Knob/King",

  // Finish last keys
  "Keys/All Heroes",

  "Tower/Naughty Sorceress",
];

export function prioritize(tasks: Task[]): Task[] {
  return orderByRoute(tasks, routing, false);
}
