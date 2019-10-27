export function sanitizePlaylistName(name) {
    const regex = /^[^\W_]+$/g;
    return regex.test(name);
}