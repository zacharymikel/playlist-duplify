export default class Track {
    constructor(jsonObj: any) {
      this.id = jsonObj.id;
      this.href = jsonObj.href;
      this.name = jsonObj.name;
    }

    id: string;
    href: string;
    name: string;
}