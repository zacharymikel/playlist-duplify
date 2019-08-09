export default class PlaylistImage {
    constructor(image: any) {
      this.height = image.height; 
      this.width = image.width;
      this.url = image.url;
    }

    height: number;
    width: number;
    url: string;
}