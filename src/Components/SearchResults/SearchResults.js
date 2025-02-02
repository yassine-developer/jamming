import React from "react";
import styles from "./SearchResults.module.css";
import Tracklist from "../Tracklist/Tracklist";

function SearchResults (props) {
    return (
        <div className={styles.SearchResults}>
        {/* <!-- Add a TrackList component --> */}
        <Tracklist userSearchResult={props.userSearchResult} isRemoval={false} onAdd={props.onAdd}/>
      </div>
        );
}

export default SearchResults;