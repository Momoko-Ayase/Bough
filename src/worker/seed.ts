import type { OrnamentId } from "../shared/types";

export interface DemoSeedItem {
  ornamentId: OrnamentId;
  senderName: string;
  message: string;
  isPrivate: boolean;
  slotIndex: number;
  pageIndex: number;
  minutesAgo: number;
}

export const DEMO_SEED_KEEPSAKES: DemoSeedItem[] = [
  {
    ornamentId: "crimson-bauble",
    senderName: "Mina",
    message:
      "May your winter evenings stay warm with kettle steam, soft wool blankets, and unhurried conversations. Thank you for always making space at your table this year.",
    isPrivate: false,
    slotIndex: 0,
    pageIndex: 0,
    minutesAgo: 340,
  },
  {
    ornamentId: "celestial-sunburst",
    senderName: "Julian",
    message:
      "Here is a little brass sun for the shortest days of the year. Wishing you bold projects, quiet mornings, and bright skies in the new season!",
    isPrivate: false,
    slotIndex: 3,
    pageIndex: 0,
    minutesAgo: 265,
  },
  {
    ornamentId: "dala-horse",
    senderName: "Sora",
    message:
      "From snowy Sapporo to your screen — thank you for walking alongside me through every late-night sprint this autumn. Let's get hot chocolate soon!",
    isPrivate: false,
    slotIndex: 5,
    pageIndex: 0,
    minutesAgo: 190,
  },
  {
    ornamentId: "wax-letter",
    senderName: "Hanna",
    message:
      "A secret note tucked into the pine needles just for you: your kindness back in October meant far more than I knew how to say out loud.",
    isPrivate: true,
    slotIndex: 7,
    pageIndex: 0,
    minutesAgo: 120,
  },
  {
    ornamentId: "winter-lantern",
    senderName: "Lin",
    message:
      "願這盞小提燈在冬夜裡為你照亮歸途，新的一年平安喜樂，萬事順遂。",
    isPrivate: false,
    slotIndex: 10,
    pageIndex: 0,
    minutesAgo: 72,
  },
  {
    ornamentId: "cloisonne-bird",
    senderName: "Haruto",
    message:
      "今年もお世話になりました！また春になったらゆっくりお茶でもしましょう。良いお年を。",
    isPrivate: false,
    slotIndex: 12,
    pageIndex: 0,
    minutesAgo: 28,
  },
];
