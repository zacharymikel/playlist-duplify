import PlaylistImage from './PlaylistImage';

export default class Playlist {
  id;
  name;
  images;
  userId;
  href;

  constructor(jsonObj) {
    this.id = jsonObj.id; 
    this.name = jsonObj.name;
    this.images = jsonObj.images && jsonObj.images.map((i) => new PlaylistImage(i)) || [];
    this.userId = jsonObj.owner.id;
    this.href = jsonObj.href;
  }
}