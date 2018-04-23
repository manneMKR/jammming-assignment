import React from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            term: '',
            searchResults: [],
            playlistName: '',
            playlistTracks: [],
        };
        this.addTrack = this.addTrack.bind(this);
        this.removeTrack = this.removeTrack.bind(this);
        this.updatePlaylistName = this.updatePlaylistName.bind(this);
        this.savePlaylist = this.savePlaylist.bind(this);
        this.search = this.search.bind(this);

    }

    search(term) {
        // Check if user still needs to sign in
        Spotify.getAccessToken();

        // Perform search for signed in user
        Spotify.userSearch(term)
            .then(searchResults => this.setState({
                searchResults: searchResults
            }));
    }

    addTrack(newTrack) {
        let trackExists = this.state.playlistTracks.some(track => { return newTrack.id === track.id });
        if (!trackExists) {
            let updatedPlaylist = this.state.playlistTracks.concat(newTrack);
            this.setState({ playlistTracks: updatedPlaylist });
        }
    }

    removeTrack(remove) {
        let updatedPlaylist = this.state.playlistTracks.filter(track => { return track.id !== remove.id });
        this.setState({ playlistTracks: updatedPlaylist });
    }

    updatePlaylistName(defaultName) {
        this.setState({ playlistName: defaultName });
    }

    savePlaylist() {
        let trackURIs = this.state.playlistTracks.map(track => { return track.uri });
        Spotify.savePlaylist(this.state.playlistName, trackURIs);
        this.setState({
            playlistTracks: []
        });
        this.updatePlaylistName('My playlist');
    }

    render() {
        return (
            <div>
                <h1>Ja<span className="highlight">mmm</span>ing</h1>
                <div className="App">
                    <SearchBar
                        onSearch={this.search}
                    />
                    <div className="App-playlist">

                        <SearchResults
                            searchResults={this.state.searchResults}
                            onAdd={this.addTrack}
                        />

                        <Playlist
                            playlistName={this.state.playlistName}
                            playlistTracks={this.state.playlistTracks}
                            onRemove={this.removeTrack}
                            onNameChange={this.updatePlaylistName}
                            onSave={this.savePlaylist}
                        />
                    </div>
                </div>
            </div >
        )
    }
};

export default App;