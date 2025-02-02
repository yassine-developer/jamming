let accessToken="";
const clientId = "8efcc73976174365949e4ab7b1e9b258";
const redirectUrl = "http://localhost:3000";

const Spotify = {

    getAccessToken() {

        //first check for the access token
        if (accessToken) {
            return accessToken;
        }

        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiryTime = window.location.href.match(/expires_in=([^&]*)/);

        //second check for the access token
        if (tokenInURL && expiryTime) {
            //setting access token and expiry time variables
            accessToken = tokenInURL[1];
            const expiresIn = Number(expiryTime[1]);

            //setting the function wich will reset the access token when it expires
            window.setTimeout(() => (accessToken = ""), expiresIn * 1000);
            //clearing the url after the token access expires
            window.history.pushState("Access token", null, "/");
            return accessToken;
        }

        //third check for the access token if the first and the second check are both false
        const redirect = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUrl}`;
        window.location = redirect;
    },

    search(term){
        accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,{
            method: 'GET',
            headers: {Authorization: `Bearer ${accessToken}`}
        })
        .then((response) => response.json())
        .then((jsonResponse) => {
            if(!jsonResponse){
                console.error("Response error");
            }
        console.log(jsonResponse);
            return jsonResponse.tracks.items.map((t) => (
                {
                    id: t.id,
                    name: t.name,
                    artist: t.artists[0].name,
                    album: t.album.name,
                    uri: t.uri,

                }));
        });
    },

    savePlaylist(name, trackUris){
        if(!name || !trackUris) {
            return;
        }
        const aToken = Spotify.getAccessToken();
        const  header = {Authorization: `Bearer ${aToken}`};
        let userId;
        let playlistId;

        return fetch(`https://api.spotify.com/v1/me`, {headers: header})
        .then(response => response.json())
        .then((jsonResponse) => {
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
             {headers: header, method: 'post', body: JSON.stringify({name}) })
             .then(response => response.json())
             .then(jsonResponse =>{
                playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
                    {
                        headers: header,
                        method: 'post',
                        body: JSON.stringify({uris: trackUris})
                    }
                )
             });

        });
    }

}

export { Spotify };