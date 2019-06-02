const { listFiles, download } = require("./request");

const cache = new Set();
const loadedAlbums = new Set();

const fillCache = async (location) => {
    if (location === undefined) return;
    let response = null;
    try {
        response = await listFiles(location);
    } catch (err) {
        console.log("oh dear...");
        console.log(err);
        throw err;
    }
    const oldSize = cache.size;
    response.files.forEach(file => cache.add(`${file.nodeid}|${file.mtime}`));
    Object.keys(response.albums).forEach(albumKey => {
        const album = response.albums[albumKey];
        if (!album.path || album.path === '') return;
        if (loadedAlbums.has(album.path)) return;
        loadedAlbums.add(album.path);
        fillCache(album.path);
    });
    console.log(`Cache size grown from ${oldSize} to ${cache.size}, loaded ${loadedAlbums.size} albums`);
    return [...cache];
}

const prepareNext = async () => {
    try {
        const nextIndex = Math.floor(Math.random() * cache.size);
        console.log(`Loading image ${nextIndex} from set with ${cache.size} elements...`);
        const next = [...cache][nextIndex];
        cache.delete(next);
        const [id, mtime] = next.split("|");
        await download(id, mtime);
        console.log('Downloaded new image');
    } catch (err) {
        console.log("oh dear...");
        console.log(err);
    }
    if (cache.size <= 1) {
        console.log("recreate cache")
        cache = new Set();
        fillCache("");
    }
}

module.exports = {prepareNext, fillCache, loadedAlbums, cache};