const genreList = ["decades"];
const howManyPlaylists = 10;
const howManyTracks = 50;
let SONGS;

const APIController = (function () {

    const clientId = 'f6e40445fd914658b70106f374c15d46';
    const clientSecret = '38aafaf3063b4fa19279c170aba9279a';

    const _getToken = async () => {

        const result = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(clientId + ':' + clientSecret)
            },
            body: 'grant_type=client_credentials'
        });
        const data = await result.json();
        return data.access_token;
    }

    const _getGenres = async (token) => {

        const result = await fetch(`https://api.spotify.com/v1/browse/categories?country=PL`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = howManyPlaylists;

        const result = await fetch(`https://api.spotify.com/v1/browse/categories/${genreId}/playlists?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {

        const limit = howManyTracks;

        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization': 'Bearer ' + token }
        });

        const data = await result.json();
        return data.items;
    }

    return {
        getToken() {
            return _getToken();
        },
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },

    }
})();

const UIController = (function () {
    return {

        storeToken(value) {
            localStorage.setItem('key', value);
        },

        getStoredToken() {
            return {
                token: localStorage.getItem('key')
            }
        }
    }

})();

function APPController(UICtrl, APICtrl) {
    const loadSongs = async () => {
        const playlists = [], tracksEndPoints = [], tracks = [];

        const token = await APICtrl.getToken();
        UICtrl.storeToken(token);

        const genres = await APICtrl.getGenres(token);

        myGenres = genres.filter(genre => genreList.includes(genre.id));

        for (let myGenre of myGenres) {
            let downloadsPlaylists = await APICtrl.getPlaylistByGenre(token, myGenre.id);
            playlists.push(...downloadsPlaylists);
        }
        playlists.forEach(playlist => tracksEndPoints.push((playlist.tracks.href)));

        for (let track of tracksEndPoints) {
            let downloadsTracks = await APICtrl.getTracks(token, track);
            tracks.push(...downloadsTracks);
        }

        return tracks.filter(obj => obj.track.preview_url != null).map(track => {
            return {
                url: track.track.preview_url,
                name: track.track.name,
                artist: track.track.artists[0].name
            }
        });
    }

    return loadSongs();
}


APPController(UIController, APIController).then(songs => {
    localStorage.setItem("tracks",JSON.stringify(songs));
});