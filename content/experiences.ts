import type { ImageKey } from "./images";

export type Experience = {
  id: string;
  title: string;
  image: ImageKey;
  body: string[];
  shapes: string; // how this choice affects the shape of an itinerary
};

export const experiences: Experience[] = [
  {
    id: "private-guiding",
    title: "Private guiding and your own vehicle",
    image: "maraVehicle",
    body: [
      "With a private vehicle, your party decides when to leave, how long to stay with a sighting and when to head back. In most camps this costs extra, so we discuss it early.",
      "We try to match the guide to the party: someone patient with children, someone who knows birds, someone who understands how a photographer wants to be positioned. Particular guides depend on availability, and we never promise a named guide before they are confirmed.",
    ],
    shapes:
      "A private vehicle makes longer, more flexible days possible and is the reason many guests stay longer in one place.",
  },
  {
    id: "photography",
    title: "Photography",
    image: "maraLeopard",
    body: [
      "For photographers, we plan around light and repetition: early starts, several mornings in the same area, and a vehicle with room for equipment. We ask about your lenses and whether you want a guide who has worked with photographers.",
      "We would usually suggest fewer camp changes and longer stays in conservancies, where vehicle numbers at sightings are limited.",
    ],
    shapes:
      "Photographers often prefer two longer stays to four short ones, and full days out with packed meals.",
  },
  {
    id: "exclusive-use",
    title: "Exclusive-use houses",
    image: "lewaLandscape",
    body: [
      "A private house with its own staff, vehicles and guides gives a family or group complete control over meals, timings and activities. Many are in Laikipia and the Mara conservancies.",
      "Most have a minimum number of guests or a minimum charge, and some require minimum stays in busy months. We will tell you plainly when a house would be better value than several rooms in a camp, and when it wouldn't.",
    ],
    shapes:
      "A house usually means fewer moves and longer stays, and more of the trip's character is set by that one place.",
  },
  {
    id: "aviation",
    title: "Flights and transfers",
    image: "maraAirstrip",
    body: [
      "Most of Kenya's safari areas are reached by light aircraft from Nairobi Wilson Airport. Scheduled bush flights follow published routes and often stop at several airstrips. A private charter flies your party on your timings and can go direct between regions. Road transfers suit shorter distances and can double as a game drive.",
      "We do not own aircraft or vehicles. For each leg, we compare the options on time, luggage limits, comfort and cost, and recommend operators we consider appropriate for the route. Helicopter flights are possible in some areas, subject to availability and permissions.",
    ],
    shapes:
      "Charter flights make some routes practical that would otherwise cost a day, such as Lewa to the Mara.",
  },
  {
    id: "permitted",
    title: "Walks, balloon flights and night drives",
    image: "maraBalloon",
    body: [
      "Guided walks are possible in many conservancies with trained guides and, in some areas, armed rangers. Night drives are generally not permitted in national reserves but are allowed in some conservancies. Dawn balloon flights operate in parts of the Mara.",
      "Each of these depends on the rules of the area, the property, the weather and, often, a minimum age. We confirm what is possible during planning rather than promising it in advance.",
    ],
    shapes:
      "If walking or night drives matter to you, they will decide whether we choose a conservancy over a reserve.",
  },
];

/** Choices that change the shape of an itinerary, shown as a table on the Experiences page. */
export const shapingChoices = [
  {
    choice: "Pace",
    effect: "Fewer, longer stays versus more regions in the same time.",
    example: "A couple on honeymoon might choose two stays in nine days rather than four.",
  },
  {
    choice: "Where you stay",
    effect: "A private house, a small camp, or a mix.",
    example: "A family of eight might take a house in Laikipia and a camp in the Mara.",
  },
  {
    choice: "How you travel",
    effect: "Charter, scheduled flights or road, leg by leg.",
    example: "A direct charter from Lewa to the Mara saves several hours compared with a scheduled connection.",
  },
  {
    choice: "Guiding",
    effect: "Shared or private vehicle, and the kind of guide.",
    example: "A photographer might want a dedicated vehicle and several mornings in the same area.",
  },
  {
    choice: "Activities",
    effect: "Walks, night drives and riding depend on area rules.",
    example: "Wanting night drives points us to a conservancy rather than the reserve.",
  },
];
