import { WedgeItem } from "./WedgeItem";
import { Subject } from 'rxjs/Subject';

export interface IWedge {
    search(query: string, results: Subject<WedgeItem>);
    action(uri: string);
}