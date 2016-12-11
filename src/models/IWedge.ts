import { IWedgeItem } from "./IWedgeItem";

export interface IWedge {
    search(query: string): IWedgeItem[];
    action(uri: string);
}