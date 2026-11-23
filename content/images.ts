/**
 * Image registry. Every image on the site is referenced by key from here, so
 * replacing a photo means changing one entry. ASSETS.md lists the same
 * information for the owner.
 *
 * status:
 *   "temporary"   openly licensed preview image. Attribution required; replace with owner-supplied or licensed photography before launch.
 *   "placeholder" no photo yet. A neutral panel with a caption is shown.
 *   "approved"    cleared for launch.
 */

export type SiteImage = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
  location: string;
  position?: string; // CSS object-position
  status: "temporary" | "placeholder" | "approved";
  credit?: { author: string; license: string; licenseUrl: string; sourceUrl: string };
  replacement: string;
};

const commons = (author: string, license: string, licenseUrl: string, sourceUrl: string) => ({ author, license, licenseUrl, sourceUrl });

export const images = {
  maraDawn: {
    src: "/images/mara-first-light.jpg",
    alt: "First light over acacia trees in the Maasai Mara",
    width: 1920,
    height: 1280,
    location: "Maasai Mara",
    position: "center 60%",
    status: "temporary",
    credit: commons("Bett Duncan", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Sunrise_with_trees_silhouette_in_the_maasai_mara.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  maraBalloon: {
    src: "/images/mara-balloon.jpg",
    alt: "A hot-air balloon drifting over the Maasai Mara plains in the early morning",
    width: 1920,
    height: 1305,
    location: "Maasai Mara",
    position: "center",
    status: "temporary",
    credit: commons("Daniel Case", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Balloon_over_Maasai_Mara_landscape,_Kenya.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  maraAirstrip: {
    src: "/images/mara-airstrip.jpg",
    alt: "A light aircraft and an open safari vehicle at Musiara airstrip in the Maasai Mara",
    width: 1920,
    height: 1145,
    location: "Maasai Mara",
    position: "center 65%",
    status: "temporary",
    credit: commons("Ninara", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Masai_Mara_National_Reserve,_Kenya_-_52515621960.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  maraAirstripShade: {
    src: "/images/mara-airstrip-shade.jpg",
    alt: "A thatched shade shelter beside an airstrip in the Maasai Mara",
    width: 1920,
    height: 1280,
    location: "Maasai Mara",
    position: "center",
    status: "temporary",
    credit: commons("Ninara", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Masai_Mara_National_Reserve_-_52496971647.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  maraVehicle: {
    src: "/images/mara-vehicle.jpg",
    alt: "An open safari vehicle parked beneath an acacia on the Mara grasslands",
    width: 1920,
    height: 1214,
    location: "Maasai Mara",
    position: "center 70%",
    status: "temporary",
    credit: commons("Daniel Case", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Safari_vehicle_parked_under_acacia_tree_on_savanna,_Maasai_Mara,_Kenya.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  maraElephant: {
    src: "/images/mara-elephant.jpg",
    alt: "An elephant beneath an acacia tree in the Mara North Conservancy",
    width: 1920,
    height: 1281,
    location: "Mara North Conservancy",
    position: "center 70%",
    status: "temporary",
    credit: commons("Daniel Case", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Elephant_under_acacia_tree,_Mara_North_Conservancy,_Kenya.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  maraLeopard: {
    src: "/images/mara-leopard.jpg",
    alt: "A male leopard walking towards the camera in the Maasai Mara",
    width: 1920,
    height: 2880,
    location: "Maasai Mara",
    position: "center 30%",
    status: "temporary",
    credit: commons("Sumeet Moghe", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Male_leopard_walking_head_on,_in_the_Maasai_Mara.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  lewaRhino: {
    src: "/images/lewa-rhino.jpg",
    alt: "A black rhino and her calf crossing open grassland in Lewa",
    width: 1920,
    height: 1440,
    location: "Lewa, Laikipia",
    position: "center 60%",
    status: "temporary",
    credit: commons("Harald Zimmer", "CC BY-SA 3.0", "http://creativecommons.org/licenses/by-sa/3.0/", "https://commons.wikimedia.org/wiki/File:Black_Rhinos_Profile.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  lewaWhiteRhino: {
    src: "/images/lewa-white-rhino.jpg",
    alt: "A white rhino in grass and acacia scrub at Lewa",
    width: 1920,
    height: 1280,
    location: "Lewa, Laikipia",
    position: "center",
    status: "temporary",
    credit: commons("Weldon Kennedy from London, UK", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Lewa_2018-1_(42514426200).jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  lewaLandscape: {
    src: "/images/lewa-landscape.jpg",
    alt: "Green hills and plains of the Lewa Wildlife Conservancy",
    width: 1920,
    height: 1277,
    location: "Lewa Wildlife Conservancy",
    position: "center",
    status: "temporary",
    credit: commons("Waterwaveke90", "CC BY-SA 4.0", "https://creativecommons.org/licenses/by-sa/4.0", "https://commons.wikimedia.org/wiki/File:Lewa_Wildlife_Conservancy.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  lewaCheetah: {
    src: "/images/lewa-cheetah.jpg",
    alt: "Three cheetahs resting beside a track in Lewa",
    width: 1920,
    height: 1280,
    location: "Lewa, Laikipia",
    position: "center",
    status: "temporary",
    credit: commons("Kevin Walsh (kevinzim) from Oxford, England", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Acinonyx_jubatus-Lewa_game_park_(Kenya).jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  lewaGiraffe: {
    src: "/images/lewa-giraffe.jpg",
    alt: "A reticulated giraffe walking along a track in Lewa",
    width: 1920,
    height: 2880,
    location: "Lewa, Laikipia",
    position: "center",
    status: "temporary",
    credit: commons("Kevin Walsh (kevinzim) from Oxford, England", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Giraffa_camelopardalis-Lewa_Kenya.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  chyuluHills: {
    src: "/images/chyulu-hills.jpg",
    alt: "Golden grassland and distant ridges in the Chyulu Hills at dusk",
    width: 1920,
    height: 1280,
    location: "Chyulu Hills",
    position: "center 70%",
    status: "temporary",
    credit: commons("Sho Hatakeyama shohatakeyama", "CC0", "http://creativecommons.org/publicdomain/zero/1.0/deed.en", "https://commons.wikimedia.org/wiki/File:Chyulu_Hills,_Kenya_(Unsplash).jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  chyuluLava: {
    src: "/images/chyulu-lava.jpg",
    alt: "The Shetani lava flow beneath the green Chyulu Hills",
    width: 1920,
    height: 1280,
    location: "Chyulu Hills",
    position: "center 60%",
    status: "temporary",
    credit: commons("Ninara", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Chyulu_Hills_and_Shetani_Lava_Flow_in_Kenya_02.jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  chyuluCones: {
    src: "/images/chyulu-cones.jpg",
    alt: "Volcanic cones of the Chyulu Hills above green bush",
    width: 1920,
    height: 1280,
    location: "Chyulu Hills",
    position: "center",
    status: "temporary",
    credit: commons("Ninara", "CC BY 2.0", "https://creativecommons.org/licenses/by/2.0", "https://commons.wikimedia.org/wiki/File:Tsavo_West_National_Park,_Kenya_(53493414096).jpg"),
    replacement: "Owner-supplied or licensed photograph of the same subject",
  },
  veranda: {
    src: null,
    alt: "A shaded veranda looking out over the bush",
    width: 1600,
    height: 2000,
    location: "Laikipia",
    status: "placeholder",
    replacement: "Owner-supplied photograph of a shaded veranda at a property Blasio is cleared to show",
  },
  outdoorTable: {
    src: null,
    alt: "A table laid for lunch outdoors under acacia shade",
    width: 1600,
    height: 2000,
    location: "Maasai Mara",
    status: "placeholder",
    replacement: "Owner-supplied photograph of a dining table set outdoors",
  },
} satisfies Record<string, SiteImage>;

export type ImageKey = keyof typeof images;
export const getImage = (k: ImageKey): SiteImage => images[k];
