import { Product } from "../product/Product";
 
// ai-search.ts
export type MessageType =
  | { type: "user"; text: string }
  | { type: "bundle"; bundle: {
      goal: string;
      reason: string;
      items: {
        uiKits: Product[];
        frontendTemplates: Product[];
        backendTemplates: Product[];
      };
    }}
  | { type: "error"; text: string };