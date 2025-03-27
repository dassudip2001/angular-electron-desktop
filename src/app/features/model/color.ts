export type ColorT = {
  target_color: String;
  top_n: number;
};

export type ColorResponseT = {
  closest_color: String;
  distance: number;
  image_name: string;
  image_path: string;
};
