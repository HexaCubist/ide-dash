import { env } from "$env/dynamic/public";

export enum Status {
  Draft = "draft",
  Published = "published",
  Archived = "archived",
}

export enum imagePresets {
  thumbnail = "thumbnail",
  aspect = "aspect-thumbnail",
  medium = "medium",
  large = "large",
  hero = "hero",
  original = "original",
}

export interface Image {
  id: string;
  src: Record<imagePresets, string>;
  alt: string;
  width: number;
  height: number;
  focal_point_x: number;
  focal_point_y: number;
}

export interface ScreenData {
  id: string;
  status: Status;
  sort: number;
  Name: string;
  Iframe_URL?: string;
  Image?: Image;
  Video?: {
    service: "youtube" | "vimeo" | "directus";
    id: string;
  };
  schedule_start?: string;
  schedule_end?: string;
}

export const getSRCSet = (id: string): Record<imagePresets, string> => {
  return Object.fromEntries(
    Object.values(imagePresets).map((p) => [
      p,
      `${env.PUBLIC_CDN_URL}/${id}?key=${p}`,
    ])
  ) as Record<imagePresets, string>;
};
