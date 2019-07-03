export default class Playlist {
    constructor() {}
    
    id: string;
    name: string;
    images: PlaylistImage[];
    userId: string;
    tracks: Track[];
    href: string;
}