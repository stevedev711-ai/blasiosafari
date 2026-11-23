import type { ImageKey } from "./images";

export type JourneyDay = {
  days: string; // "Day 1" or "Days 3–4"
  title: string;
  body: string;
  region: string;
};

export type NightStop = {
  region: string;
  nights: number;
  stay: string;
  why: string;
};

export type Journey = {
  slug: string;
  title: string;
  length: string; // "9 days"
  nights: number;
  image: ImageKey;
  detailImage: ImageKey;
  summary: string;
  intro: string[];
  bestFor: string[];
  route: string[]; // ordered stops for the route line
  routeNote: string;
  days: JourneyDay[];
  nightsByRegion: NightStop[];
  couldChange: { title: string; body: string }[];
  conditions: string;
  seasonNote: string;
};

export const journeys: Journey[] = [
  {
    slug: "private-migration-circuit",
    title: "The Private Migration Circuit",
    length: "9 days",
    nights: 8,
    image: "maraBalloon",
    detailImage: "maraElephant",
    summary:
      "Two bases in the Maasai Mara: a quiet private conservancy first, then a camp within reach of the Mara River for the crossing season.",
    intro: [
      "This sample journey is built for travellers who want the Mara during the migration months without spending the whole stay among other vehicles. It begins in a private conservancy on the edge of the reserve, where vehicle numbers at sightings are limited and guided walks and night drives may be possible, then moves closer to the river for the days most likely to produce a crossing.",
      "There are only two lodge changes after Nairobi. Most guests find that enough movement for nine days, and it leaves time for slow mornings, an afternoon at the house, or a full day waiting at the river if that is what you came for.",
    ],
    bestFor: [
      "Couples who want privacy and only one change of camp",
      "First visits to Kenya timed for July to October",
      "Photographers who want repeat mornings in the same area",
    ],
    route: ["Nairobi", "Mara conservancy", "Mara River area", "Nairobi"],
    routeNote:
      "Flights between Nairobi Wilson Airport and the Mara airstrips are short. We would assess scheduled bush flights and a private charter against your timings, luggage and party size. The move between the two Mara bases is often done by road as a game drive.",
    days: [
      {
        days: "Day 1",
        title: "Arrive in Nairobi",
        region: "Nairobi",
        body: "Met on arrival and driven to a quiet residence on the edge of the city. If you land in the morning there is time to rest before dinner. If you land late, we keep the evening simple and the next start unhurried.",
      },
      {
        days: "Day 2",
        title: "Fly to the Mara",
        region: "Mara conservancy",
        body: "A morning flight from Wilson Airport to an airstrip close to your first base. Your guide meets you with the vehicle you will use for the stay. The first afternoon is usually a gentle drive to learn the area and agree on how early you want to start.",
      },
      {
        days: "Days 3–5",
        title: "Conservancy days",
        region: "Mara conservancy",
        body: "Mornings out with your own guide and vehicle, at the time that suits you. Depending on the conservancy and the property, there may be a guided walk with Maasai guides, a night drive after dinner, or a bush breakfast. One afternoon is deliberately left open for time at the house.",
      },
      {
        days: "Day 6",
        title: "Across to the river",
        region: "Mara River area",
        body: "A road transfer through the reserve, taken slowly as a game drive, to a camp within reach of the Mara River. Where the distance or timing makes the drive impractical, a short hop by air is the alternative.",
      },
      {
        days: "Day 7",
        title: "A day for the crossings",
        region: "Mara River area",
        body: "If the herds are gathering near the river, we plan a full day with breakfast and lunch packed so you can stay with them. Crossings cannot be predicted to the hour or even the day, and waiting is part of it. Your guide will read the herds and the other vehicles and position you accordingly.",
      },
      {
        days: "Day 8",
        title: "An optional balloon flight at dawn",
        region: "Mara River area",
        body: "Where an operator is permitted to fly in the area, a dawn balloon flight lands in time for breakfast on the plains. If ballooning does not appeal, this is another full morning on the ground. The final evening is kept at camp.",
      },
      {
        days: "Day 9",
        title: "Return to Nairobi",
        region: "Nairobi",
        body: "A morning flight to Nairobi, then a day room and dinner before an evening international departure, or an onward connection to the coast or another region.",
      },
    ],
    nightsByRegion: [
      {
        region: "Nairobi",
        nights: 1,
        stay: "A quiet residence or small hotel on the edge of the city",
        why: "Rest after the long-haul flight, close to Wilson Airport for the morning departure.",
      },
      {
        region: "Maasai Mara: private conservancy",
        nights: 4,
        stay: "An exclusive-use house or a small tented camp",
        why: "Fewer vehicles at sightings, and activities that depend on conservancy rules such as walks and night drives.",
      },
      {
        region: "Maasai Mara: Mara River area",
        nights: 3,
        stay: "A small camp within reach of the river",
        why: "Shorter drives to the crossing points during the migration months.",
      },
    ],
    couldChange: [
      {
        title: "Travel outside the migration months",
        body: "From November to June we would usually drop the river camp, extend the conservancy stay, or add Lewa or the Chyulu Hills.",
      },
      {
        title: "One base instead of two",
        body: "Some guests prefer to stay in one conservancy for the whole Mara stay and make full-day excursions to the river.",
      },
      {
        title: "Charter or scheduled flights",
        body: "A charter can match your timings and luggage. Scheduled bush flights are a sensible choice when the timings already suit you.",
      },
      {
        title: "Family pace",
        body: "A private house with later starts, shorter drives, and guides who are good with children. Minimum ages for walks and some vehicles vary by property.",
      },
      {
        title: "Photography focus",
        body: "A vehicle set up for cameras, a guide who understands light and positioning, and fewer moves so you can return to the same subjects.",
      },
    ],
    conditions:
      "This is a sample journey, not a fixed itinerary or a quote. The migration does not follow a calendar, and river crossings vary from year to year and week to week. Wildlife sightings, particular guides, private properties, balloon flights, walks and night drives depend on conditions, availability, and the rules of each reserve and conservancy.",
    seasonNote:
      "The herds are often in the Mara from around July to October, but timing changes every year with the rains.",
  },
  {
    slug: "rhino-and-big-cat-journey",
    title: "The Rhino & Big Cat Journey",
    length: "11 days",
    nights: 10,
    image: "lewaRhino",
    detailImage: "lewaLandscape",
    summary:
      "Rhino country on the Laikipia plateau beneath Mount Kenya, then a long stay in a Mara conservancy for lion, leopard and cheetah.",
    intro: [
      "This sample journey pairs two very different parts of Kenya. The first half is spent in Lewa, where black and white rhino share open country with Grevy's zebra and reticulated giraffe, and where conservation work is close at hand. The second half is a longer stay in a private Mara conservancy, given over to the big cats.",
      "Lewa and the Mara are far apart, so how you travel between them shapes the middle of the trip. We set out the options below.",
    ],
    bestFor: [
      "Repeat visitors to Africa who want more than one landscape",
      "Families with older children interested in conservation",
      "Wildlife photographers who want rhino and big cats in one trip",
    ],
    route: ["Nairobi", "Lewa & Laikipia", "Mara conservancy", "Nairobi"],
    routeNote:
      "There is no practical road route between Lewa and the Mara. A private charter can fly directly between the two. Scheduled services usually connect through Nairobi or another airstrip, which can take most of a day. We would compare both with you.",
    days: [
      {
        days: "Day 1",
        title: "Arrive in Nairobi",
        region: "Nairobi",
        body: "Met on arrival and taken to a quiet residence for the night. If time and energy allow the next morning, a short visit in Nairobi can be added before the flight north.",
      },
      {
        days: "Day 2",
        title: "North to Lewa",
        region: "Lewa & Laikipia",
        body: "A flight north from Wilson Airport toward Mount Kenya. Lewa sits higher than the Mara, so mornings and evenings are cooler. The first afternoon is a drive with your guide to get a feel for the country.",
      },
      {
        days: "Days 3–4",
        title: "Rhino country",
        region: "Lewa & Laikipia",
        body: "Mornings looking for black and white rhino, with time for the northern species that are hard to see in the Mara. Where the conservancy and the property permit it, there may be the chance to learn about rhino monitoring from the teams who do it, or to walk with an armed ranger. These are not guaranteed and are confirmed during planning.",
      },
      {
        days: "Day 5",
        title: "A flexible day",
        region: "Lewa & Laikipia",
        body: "Kept open on purpose. Some guests go back to the rhino areas. Others take a guided walk or horseback ride where offered, or a scenic flight if the weather is clear. Some simply stay at the house.",
      },
      {
        days: "Day 6",
        title: "Across Kenya to the Mara",
        region: "Mara conservancy",
        body: "By private charter, a direct flight south-west to a Mara airstrip, arriving in time for an afternoon drive. On scheduled flights, the connection through Nairobi takes longer, and we would plan a quieter first afternoon.",
      },
      {
        days: "Days 7–9",
        title: "Big cat country",
        region: "Mara conservancy",
        body: "Long mornings with a private guide and vehicle, following lion prides, cheetah and, with patience, leopard. Night drives and walks are possible in some conservancies. We plan these days loosely so you can stay with a sighting rather than return for a schedule.",
      },
      {
        days: "Day 10",
        title: "Last full day in the Mara",
        region: "Mara conservancy",
        body: "A dawn balloon flight is an option where permitted. Otherwise, a final full morning out, and a last evening at camp.",
      },
      {
        days: "Day 11",
        title: "Return to Nairobi",
        region: "Nairobi",
        body: "A morning flight to Nairobi with a day room before an evening departure, or a connection onward.",
      },
    ],
    nightsByRegion: [
      {
        region: "Nairobi",
        nights: 1,
        stay: "A quiet residence or small hotel on the edge of the city",
        why: "Recovery after arrival, and a short drive to Wilson Airport.",
      },
      {
        region: "Lewa & Laikipia",
        nights: 4,
        stay: "An exclusive-use house or a small lodge on a private conservancy",
        why: "Time for rhino and the northern species, and a slower day in the middle.",
      },
      {
        region: "Maasai Mara: private conservancy",
        nights: 5,
        stay: "A small camp or an exclusive-use house",
        why: "A longer stay improves your chances with lion, cheetah and leopard.",
      },
    ],
    couldChange: [
      {
        title: "Add the Chyulu Hills",
        body: "Three nights in the Chyulu Hills before Lewa adds Kilimanjaro views, open grassland and riding. It usually means one more charter leg.",
      },
      {
        title: "Shorten to nine days",
        body: "Take one night from each region. It still works, but the flexible day in Lewa is the first thing to go.",
      },
      {
        title: "Charter between regions",
        body: "This is the leg where a private charter saves the most time. We would show the difference clearly so you can decide whether it is worth it.",
      },
      {
        title: "Migration season",
        body: "From roughly July to October, the Mara half can include a few nights nearer the river.",
      },
      {
        title: "Children in the party",
        body: "Some activities have minimum ages. We would choose properties where children are genuinely welcome, not just accepted.",
      },
    ],
    conditions:
      "This is a sample journey, not a fixed itinerary or a quote. Rhino and big cat sightings cannot be guaranteed. Particular guides, private properties, conservation visits, walks, night drives, horseback activities and balloon flights depend on conditions, availability, age limits, and the permissions of each conservancy.",
    seasonNote:
      "Both regions can be visited for much of the year. The long rains, usually around April and May, can affect roads and some properties close.",
  },
];

export const getJourney = (slug: string) => journeys.find((j) => j.slug === slug);
