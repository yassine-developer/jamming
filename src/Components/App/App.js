import { useState } from "react";
import React  from "react";
import styles from "./App.module.css";
import SearchResults from "../SearchResults/SearchResults";
import Playlist from "../Playlist/Playlist";
import SearchBar from "../SearchBar/SearchBar";
import {Spotify} from "../../util/Spotify";

function App () {
  const [searchResults, setSearchResults] = useState([{
    name: "example track name 1",
    artist: "example track artist 1",
    album: "example track album 1",
    id: 1
  },
  {
    name: "example track name 2",
    artist: "example track artist 2",
    album: "example track album 2",
    id: 2
  }]
  );
  const [playlistName, setPlaylistName] = useState("example playlist name");
  const [playlistTracks, setPlaylistTracks] = useState([{
    name: "example playlist name 1",
    artist: "example playlist artist 1",
    album: "example playlist album 1",
    id: 11
  },
  {
    name: "example playlist name 2",
    artist: "example playlist artist 2",
    album: "example playlist album 2",
    id: 22
  },
  {
    name: "example playlist name 3",
    artist: "example playlist artist 3",
    album: "example playlist album 3",
    id: 33
  }
  ]);

  function addTrack(track){
    const existingTrack = playlistTracks.find(t => t.id === track.id);
    const newTrack = playlistTracks.concat(track);
    if (existingTrack){
      console.log("track already exists");
    }else{
      setPlaylistTracks(newTrack);
    }
  }

  function removeTrack(track){
    const existingTrack = playlistTracks.filter((t) => t.id !== track.id);
    setPlaylistTracks(existingTrack);
  }

  function updatePlaylistName(name){
    setPlaylistName(name);
  }

  function savePlaylist(){
    const trackURIs = playlistTracks.map((t) => t.uri);
    Spotify.savePlaylist(playlistName, trackURIs).then(() => {
      setPlaylistName("New Playlist");
      setPlaylistTracks([]);
    })
  }

  function search(term){
    Spotify.search(term).then(result => setSearchResults(result));
    console.log(term);
  }

    return (
        <div>
          <h1>
            Ja<span className={styles.highlight}>mmm</span>ing
          </h1>
          <div className={styles.App}>
            {/* <!-- Add a SearchBar component --> */}
            <SearchBar onSearch={search}/>
            <div className={styles['App-playlist']}>
              {/* <!-- Add a SearchResults component --> */}
              <SearchResults userSearchResult={searchResults} onAdd={addTrack}/>
              {/* <!-- Add a Playlist component --> */}
              <Playlist 
              playlistName={playlistName} 
              playlistTracks={playlistTracks} 
              onRemove={removeTrack}
              onNameChange={updatePlaylistName}
              onSave={savePlaylist}/>
            </div>
          </div>
        </div>
        );
}

export default App;
 