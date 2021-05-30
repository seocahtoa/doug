const fs = require('fs')
const SpotifyWebApi = require('spotify-web-api-node');
const token = "BQBKkZGvcaV-mBHSMCm5_6jiEhL6saKZHvir7m9nMwgtGD7w3SVY5XCChk-_y2F--EePG1nPDj625NhMrHjAMn9SB-k78Bt5fhFp2RtpUzMBkRuw8gNyVOjyAD0tZz5ica-p2R5ELI5yZzlox98wwU4v5OJYVbIgFfRCvkSsY9uYSK8sU4ko50Fa971oCbBBYd9HMC4ovYQZ3REHTmt7UTug3lry1ogP1KG40eVMuPMl1l4f4PgL1USbOrIayCgekTyyNj_SRIXQz0Q6VhbSpNICQ4C55xWT";

const spotifyApi = new SpotifyWebApi();
spotifyApi.setAccessToken(token);

//GET MY PROFILE DATA
function getMyData() {
  (async () => {
    const me = await spotifyApi.getMe();
    // console.log(me.body);
    const artist = await spotifyApi.getArtistTopTracks('5K4W6rqBFWDnAN6FQUkS6x', 'US');
    console.log(artist.body);
  })().catch(e => {
    console.error(e);
  });
}

//GET MY PLAYLISTS
async function getUserPlaylists(userName) {
  const data = await spotifyApi.getUserPlaylists(userName)

  console.log("---------------+++++++++++++++++++++++++")
  let playlists = []

  for (let playlist of data.body.items) {
    console.log(playlist.name + " " + playlist.id)
    
    let tracks = await getPlaylistTracks(playlist.id, playlist.name);
    // console.log(tracks);

    const tracksJSON = { tracks }
    let data = JSON.stringify(tracksJSON);
    fs.writeFileSync(playlist.name+'.json', data);
  }
}

//GET SONGS FROM PLAYLIST
async function getPlaylistTracks(playlistId, playlistName) {

  const data = await spotifyApi.getPlaylistTracks(playlistId, {
    offset: 1,
    limit: 100,
    fields: 'items'
  })

  // console.log('The playlist contains these tracks', data.body);
  // console.log('The playlist contains these tracks: ', data.body.items[0].track);
  // console.log("'" + playlistName + "'" + ' contains these tracks:');
  let tracks = [];

  for (let track_obj of data.body.items) {
    const track = track_obj.track
    tracks.push(track);
    console.log(track.name + " : " + track.artists[0].name)
  }
  
  console.log("---------------+++++++++++++++++++++++++")
  return tracks;
}

getMyData();