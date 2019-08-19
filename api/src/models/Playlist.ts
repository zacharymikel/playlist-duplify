import PlaylistImage from './PlaylistImage';

export default class Playlist {
  id: string;
  name: string;
  images: PlaylistImage[];
  userId: string;
  href: string;

  constructor(jsonObj: any) {
    this.id = jsonObj.id; 
    this.name = jsonObj.name;
    this.images = jsonObj.images && jsonObj.images.map((i: any): any => new PlaylistImage(i)) || [];
    this.userId = jsonObj.owner.id;
    this.href = jsonObj.href;
  }
}