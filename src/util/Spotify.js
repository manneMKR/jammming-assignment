const clientID = 'dc4023f7df2c46228a371dc2963266e1';
const redirectURI = 'http://localhost:3000/';

let accessToken = '';
let expiresIn = '';

const Spotify = {

    getAccessToken() {
        // Check if userAccessToken is already set
        if (accessToken !== '') {
            return accessToken;
        }

        // Check the URL to see if userAccessToken has just been obtained
        const isAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const isExpiresIn = window.location.href.match(/expires_in=([^&]*)/);

        if (isAccessToken && isExpiresIn) {
            accessToken = isAccessToken[1];
            expiresIn = isExpiresIn[1];
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            // Return something?
        } else {
            // The third condition is that the access token variable is empty and is not in the URL
            window.open(`https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`, "_self");
        }
    },

    userSearch(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: { Authorization: `Bearer ${accessToken}` } 
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks) return [];
            return jsonResponse.tracks.items.map(track => {
                return {
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }
            })
        });
    },

    savePlaylist(playlistName, trackURIs) {
        if (playlistName === null || trackURIs === null) {
            return;
        }

        // let accessToken = accessToken
        let userID = '';
        const profileURL = 'https://api.spotify.com/v1/me';
        const headers = { Authorization: `Bearer ${accessToken}` }
        let playlistID = '';

        fetch(profileURL, {
            headers: headers
        }).then(response => {
            return response.json()
        }).then(jsonResponse => userID = jsonResponse.id
        ).then(() => {
            const createPlaylistURL = `https://api.spotify.com/v1/users/${userID}/playlists`;
            fetch(createPlaylistURL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify({
                    name: playlistName
                })
            }).then(response => {
                return response.json()
            }).then(jsonResponse => playlistID = jsonResponse.id
            ).then(() => {
                const addPlaylistTrackURL = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
                fetch(addPlaylistTrackURL, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        uris: trackURIs
                    })
                });
            })
        })
    },
};

export default Spotify;
