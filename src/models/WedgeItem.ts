export class WedgeItem {
    uri: string

    title: string

    wedge?: string // set by wedg.it  

    constructor(uri?: string, title?: string) {
        this.uri = uri;
        this.title = title;
    }
}