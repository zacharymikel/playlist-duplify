export default class Track {
    constructor(jsonObj) {
      this.id = jsonObj.id;
      this.href = jsonObj.href;
      this.name = jsonObj.name;
    }

    id;
    href;
    name;
}