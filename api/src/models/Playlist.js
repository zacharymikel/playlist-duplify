import PlaylistImage from './PlaylistImage';

export default class Playlist {
  id;
  name;
  images;
  userId;
  href;
  public;
  collaborative;

  constructor(playlist) {
    this.id = playlist.id; 
    this.name = playlist.name;
    this.images = playlist.images && playlist.images.map((i) => new PlaylistImage(i)) || [];
    this.userId = playlist.owner.id;
    this.href = playlist.href;
    this.public = playlist.public;
    this.collaborative = playlist.collaborative;
  }
}