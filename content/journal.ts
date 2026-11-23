import type { ImageKey } from "./images";

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: { term?: string; text: string }[] }
  | { type: "note"; text: string };

export type Article = {
  slug: string;
  title: string;
  description: string;
  image: ImageKey;
  readingTime: string;
  related: { label: string; href: string }[];
  consultationContext: string;
  blocks: ArticleBlock[];
};

export const articles: Article[] = [
  {
    slug: "choosing-an-exclusive-use-safari-house-in-kenya",
    title: "How to choose an exclusive-use safari house in Kenya",
    description:
      "When a private house makes more sense than rooms in a camp, and the questions to ask before you choose one in Laikipia or the Mara.",
    image: "lewaLandscape",
    readingTime: "7 min read",
    related: [
      { label: "Lewa & Laikipia", href: "/destinations/lewa-laikipia" },
      { label: "Exclusive-use houses", href: "/experiences#exclusive-use" },
    ],
    consultationContext: "Exclusive-use house",
    blocks: [
      {
        type: "p",
        text: "An exclusive-use house is a safari property taken by a single party for the length of a stay. It comes with its own staff, and usually its own guides and vehicles. In Kenya, most are on private or community conservancies in Laikipia and around the Maasai Mara, with a few in other regions. A house gives you control of the day: when you eat, when you go out, how long you stay out, and who you share the evening with.",
      },
      {
        type: "p",
        text: "That control is valuable, but a house is not automatically the right choice. Here is how we think it through with guests.",
      },
      { type: "h2", text: "When a house makes sense" },
      {
        type: "list",
        items: [
          {
            term: "Your party is four or more.",
            text: "Many houses have a minimum charge equivalent to a set number of guests. Below that number, you are paying for space you don't use.",
          },
          {
            term: "You are travelling with children or older relatives.",
            text: "Meals at any hour, later starts, a pool or garden in sight of the veranda, and no other guests to consider at dinner can make the whole trip easier.",
          },
          {
            term: "You want one long stay rather than several short ones.",
            text: "A house rewards four or five nights. Over two nights, a camp often gives more for less.",
          },
          {
            term: "Privacy matters for reasons beyond preference.",
            text: "Some guests need to know exactly who is on site. A house lets that be arranged.",
          },
        ],
      },
      { type: "h2", text: "When a camp may be the better choice" },
      {
        type: "p",
        text: "Couples and solo travellers often prefer a small camp with a private vehicle. You still decide your own timings, the cost is usually lower, and some guests enjoy the atmosphere of a few other people at the fire in the evening. If the reason for wanting a house is simply to avoid crowds, a small camp in a conservancy that limits vehicles at sightings may achieve the same result.",
      },
      { type: "h2", text: "Questions to ask about any house" },
      {
        type: "list",
        items: [
          {
            term: "What is included?",
            text: "Check whether guiding, vehicles, drinks, laundry, conservancy fees and activities such as walks or riding are included or charged separately. Two houses with similar headline rates can differ widely once these are added.",
          },
          {
            term: "How many vehicles and guides come with it?",
            text: "A family of eight with different interests may want two vehicles so the early risers and the late sleepers aren't tied to each other.",
          },
          {
            term: "What can you do from the house?",
            text: "Walking, night drives, riding and visits to conservation projects depend on the conservancy's rules and the property's permissions. Ask what is actually permitted where the house is, not what is possible in the region.",
          },
          {
            term: "How are the bedrooms arranged?",
            text: "Separate cottages give privacy. Connected rooms are better with young children. Check for twin options and whether any rooms are up steps or slopes.",
          },
          {
            term: "What are the minimum stay and the minimum charge?",
            text: "Both can rise in busy months. Ask about them before you fall for the photographs.",
          },
          {
            term: "How far is the airstrip?",
            text: "A short drive means you can arrive in time for an afternoon out. A long one can use up half a day.",
          },
          {
            term: "What are the arrangements for medical care and communication?",
            text: "Ask about first aid, the nearest airstrip for evacuation, and whether there is phone or internet signal if you need to stay in touch with work.",
          },
        ],
      },
      { type: "h2", text: "Laikipia or the Mara?" },
      {
        type: "p",
        text: "Laikipia has the larger choice of houses, generally more activities from the door, rhino on several conservancies, and cooler evenings at altitude. In the Mara conservancies, the draw is the concentration of big cats and, in the migration months, the herds. Families and groups often combine the two, with a house in Laikipia and a camp or house in the Mara, linked by a charter flight.",
      },
      {
        type: "note",
        text: "We don't publish rates for individual houses because they depend on dates, numbers and what is included. In a proposal we set out the same comparison for each option so you can weigh them on equal terms.",
      },
    ],
  },
  {
    slug: "when-a-private-charter-makes-sense",
    title: "When a private charter makes sense on a multi-stop Kenya safari",
    description:
      "How to weigh a private charter against scheduled bush flights and road transfers, leg by leg, on a trip that links several regions.",
    image: "maraAirstrip",
    readingTime: "6 min read",
    related: [
      { label: "Flights and transfers", href: "/experiences#aviation" },
      { label: "The Rhino & Big Cat Journey", href: "/journeys/rhino-and-big-cat-journey" },
    ],
    consultationContext: "Private charter question",
    blocks: [
      {
        type: "p",
        text: "Most of Kenya's safari regions are reached by light aircraft, usually from Nairobi Wilson Airport. You can fly on scheduled bush flights, charter an aircraft for your party, or, for shorter distances, go by road. On a trip with several stops, the right answer is often a mix. We look at each leg separately rather than choosing one way to travel for the whole trip.",
      },
      { type: "h2", text: "How the options differ" },
      {
        type: "list",
        items: [
          {
            term: "Scheduled bush flights",
            text: "follow published routes and times, and often stop at several airstrips on the way. They are reliable and good value when the timings suit you. Baggage limits are strict and soft bags are usually required.",
          },
          {
            term: "A private charter",
            text: "flies only your party, at a time agreed with you, and can fly directly between regions that scheduled routes don't connect. Charters still have baggage and weight limits set by the aircraft.",
          },
          {
            term: "Road transfers",
            text: "suit shorter distances. Within the Mara, a transfer between camps can double as a game drive. Over longer distances, a drive can take most of a day.",
          },
        ],
      },
      { type: "h2", text: "Five situations where a charter is worth considering" },
      {
        type: "list",
        items: [
          {
            term: "Between regions without a direct scheduled link.",
            text: "Lewa to the Maasai Mara is a common example. A scheduled connection usually goes through Nairobi, and the day can disappear. A direct charter can have you in the Mara for the afternoon drive.",
          },
          {
            term: "When your party fills most of an aircraft.",
            text: "For a family or group, the cost difference narrows as the number of seats you would otherwise buy goes up.",
          },
          {
            term: "When timing matters.",
            text: "Meeting an international departure, avoiding a very early start with young children, or leaving after a final morning drive.",
          },
          {
            term: "When you are carrying extra equipment.",
            text: "Photographers with heavy kit can sometimes arrange extra capacity on a charter that a scheduled flight cannot offer. This must be agreed in advance with the operator.",
          },
          {
            term: "When the airstrip is off the scheduled network.",
            text: "Some houses and smaller conservancies are closest to airstrips served only by charter.",
          },
        ],
      },
      { type: "h2", text: "When a scheduled flight is the sensible choice" },
      {
        type: "p",
        text: "For a couple flying from Nairobi to the Mara and back, scheduled flights often fit the plan well and cost much less. The time saved by a charter on a short, well-served route may be small. We would rather put that budget toward a private vehicle or an extra night than recommend a charter that makes little difference.",
      },
      { type: "h2", text: "What to ask before you decide" },
      {
        type: "list",
        items: [
          { text: "How much time does each option take from door to door, including stops and connections?" },
          { text: "What are the baggage limits per person, and are soft bags required?" },
          { text: "Who operates the aircraft, and what type is it?" },
          { text: "What happens if weather or a closed airstrip delays the flight?" },
          { text: "Is there a cost for positioning an empty aircraft to collect you?" },
        ],
      },
      {
        type: "note",
        text: "We don't own aircraft. For each leg we compare the options available at the time, and the proposal shows the trade-off between time and cost so you can decide.",
      },
    ],
  },
];

export const getArticle = (slug: string) => articles.find((a) => a.slug === slug);
