import type { ImageKey } from "./images";

export type Destination = {
  slug: string;
  name: string;
  shortName: string;
  image: ImageKey;
  detailImage: ImageKey;
  reason: string; // the one-line distinct reason to go
  intro: string[];
  distinguishes: { title: string; body: string }[];
  fitsInTrip: string[];
  consider: { title: string; body: string }[];
  gettingThere: string;
  typicalStay: string;
  relatedJourneys: string[];
};

export const destinations: Destination[] = [
  {
    slug: "maasai-mara",
    name: "The Maasai Mara",
    shortName: "Maasai Mara",
    image: "maraDawn",
    detailImage: "maraVehicle",
    reason:
      "Kenya's great predator country, and the stage for the migration in the dry-season months. Where you stay within it matters more than anywhere else in Kenya.",
    intro: [
      "The Mara is open, rolling grassland in south-west Kenya, bordered to the south by Tanzania's Serengeti. It is known for lion, cheetah and leopard, and for the wildebeest and zebra herds that move through it in the dry season.",
      "The national reserve sits at the centre. Around it are private and community conservancies, where land is leased from Maasai landowners and visitor numbers are limited. The choice between them shapes the experience more than the choice of camp.",
    ],
    distinguishes: [
      {
        title: "Big cats in open country",
        body: "Predator sightings are the Mara's main strength, and the open plains mean you can often watch behaviour for long stretches.",
      },
      {
        title: "Reserve and conservancies",
        body: "The reserve gives access to the main river crossing points. The conservancies limit vehicles at sightings and may permit guided walks and night drives, subject to their rules.",
      },
      {
        title: "Seasonal drama",
        body: "In the migration months the herds and river crossings draw visitors. Outside them, the resident wildlife remains and the conservancies are quieter still.",
      },
    ],
    fitsInTrip: [
      "Three to five nights is a common stay. A longer stay suits photographers and anyone who wants a slower pace.",
      "It works as the centre of a first trip, or as the second half after Lewa or the Chyulu Hills.",
      "Many guests split their nights between a conservancy and a camp nearer the river during the migration months.",
    ],
    consider: [
      {
        title: "Conservancy or reserve",
        body: "Do you want fewer vehicles and walks, or direct access to the river? Many guests do both, in that order.",
      },
      {
        title: "When you travel",
        body: "The migration usually reaches the Mara from around July to October, but the timing changes with the rains. Outside that window the plains are quieter and green.",
      },
      {
        title: "How early you like to start",
        body: "The best light and much of the activity come in the first hours after dawn. A private vehicle means you choose the start time.",
      },
      {
        title: "Ballooning",
        body: "Dawn balloon flights operate in parts of the Mara. Availability depends on where you stay and the operator's permissions.",
      },
    ],
    gettingThere:
      "Scheduled flights and private charters from Nairobi Wilson Airport reach a number of Mara airstrips in a short flight. Driving from Nairobi takes most of a day.",
    typicalStay: "3–5 nights",
    relatedJourneys: ["private-migration-circuit", "rhino-and-big-cat-journey"],
  },
  {
    slug: "lewa-laikipia",
    name: "Lewa & Laikipia",
    shortName: "Lewa & Laikipia",
    image: "lewaLandscape",
    detailImage: "lewaRhino",
    reason:
      "High, open country north of Mount Kenya, with rhino, northern species and some of Kenya's most private conservancies and houses.",
    intro: [
      "The Laikipia plateau lies north and west of Mount Kenya. It is a patchwork of private ranches, community conservancies and wildlife reserves, and much of it is used by only a few properties.",
      "Lewa, on its north-eastern edge, is known for rhino conservation and is part of the Mount Kenya UNESCO World Heritage Site. Laikipia offers a wider range of activities than most national parks, from walking and riding to camel trekking, depending on the property.",
    ],
    distinguishes: [
      {
        title: "Rhino country",
        body: "Lewa and several Laikipia conservancies protect black and white rhino. Seeing them in open country, with the people who protect them nearby, is the reason many guests come.",
      },
      {
        title: "Northern species",
        body: "Grevy's zebra, reticulated giraffe, Beisa oryx and gerenuk are found here and in the north, but not in the Mara.",
      },
      {
        title: "Privacy and variety",
        body: "Exclusive-use houses are common in Laikipia, and activities such as walking, riding and night drives depend on the property and conservancy.",
      },
    ],
    fitsInTrip: [
      "Three or four nights works well, often at the start of a trip before the Mara.",
      "Its altitude makes evenings cool and mornings crisp, a good contrast with the Mara or the coast.",
      "It suits families and groups who want one house, a fixed team, and a range of things to do without long drives.",
    ],
    consider: [
      {
        title: "Lewa or wider Laikipia",
        body: "Lewa is the best known for rhino. Other Laikipia conservancies may offer more riding, more seclusion or a better fit for children.",
      },
      {
        title: "Exclusive use",
        body: "If you are four or more, a private house can make sense. We would compare the minimum number of guests and the minimum stay.",
      },
      {
        title: "Linking to the Mara",
        body: "There is no practical road link. A direct charter or a scheduled connection through Nairobi are the usual options.",
      },
      {
        title: "Activity rules",
        body: "Walking with rangers, conservation visits, riding and night drives each depend on the conservancy and property, and some have age limits.",
      },
    ],
    gettingThere:
      "Scheduled flights and charters from Nairobi Wilson reach Lewa and other Laikipia airstrips. The drive from Nairobi takes several hours on good roads.",
    typicalStay: "3–4 nights",
    relatedJourneys: ["rhino-and-big-cat-journey"],
  },
  {
    slug: "chyulu-hills",
    name: "The Chyulu Hills",
    shortName: "Chyulu Hills",
    image: "chyuluHills",
    detailImage: "chyuluLava",
    reason:
      "Green volcanic hills between Tsavo and Amboseli, with Kilimanjaro on the horizon. Come for space, landscape and riding, not long wildlife checklists.",
    intro: [
      "The Chyulu Hills are a young volcanic range in southern Kenya, between Tsavo West and Amboseli. Grassy ridges, forest patches and old lava flows give way to wide plains, and on clear mornings Kilimanjaro stands above the horizon.",
      "Wildlife here is more spread out than in the Mara. Elephant and other species move through the wider ecosystem, and the area is better suited to walking, riding and time outdoors than to counting sightings.",
    ],
    distinguishes: [
      {
        title: "Kilimanjaro views",
        body: "The mountain is often clearest at dawn and dusk. It can stay in cloud for days, so we do not plan around it.",
      },
      {
        title: "Volcanic landscape",
        body: "Lava flows, caves and green hills make this part of Kenya look unlike the plains further west.",
      },
      {
        title: "Room to move",
        body: "Horseback riding, walks and picnics in open country, where offered, suit families and guests who like to be active.",
      },
    ],
    fitsInTrip: [
      "Two or three nights is usually enough. It works as a quiet first stop after Nairobi or a gentle close to a trip.",
      "It pairs well with the Mara, with the change of scenery and pace that comes from the contrast.",
      "Guests who want a beach ending can connect onward to the coast.",
    ],
    consider: [
      {
        title: "Wildlife expectations",
        body: "If big cats are the priority, spend more nights in the Mara. The Chyulu Hills reward a different kind of trip.",
      },
      {
        title: "Getting in and out",
        body: "Fewer scheduled flights serve the area, so a charter is often more practical when linking to other regions.",
      },
      {
        title: "Riding ability",
        body: "Horseback safaris, where available, usually require some riding experience. We would check the requirements with the property.",
      },
    ],
    gettingThere:
      "Usually by light aircraft from Nairobi Wilson or another region. The drive from Nairobi takes most of a day.",
    typicalStay: "2–3 nights",
    relatedJourneys: ["rhino-and-big-cat-journey"],
  },
];

export const getDestination = (slug: string) => destinations.find((d) => d.slug === slug);
