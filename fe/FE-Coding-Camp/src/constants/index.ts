export * from "./blockchain";
export * from "./url";
export * from "./date";

export const SERVER_ENDPOINT = process.env.NEXT_PUBLIC_SERVER_ENDPOINT || "";
export const SOL_TREASURY_ADDRESS =
  process.env.NEXT_PUBLIC_SOL_TREASURY_ADDRESS || "";
export const GOVERNOR_ADDRESS = process.env.NEXT_PUBLIC_GOVERNOR_ADDRESS || "";
export const PROGRAM_ADDRESS = process.env.NEXT_PUBLIC_PROGRAM_ADDRESS || "";
export const SETTING_ADDRESS = process.env.NEXT_PUBLIC_SETTING_ADDRESS || "";
