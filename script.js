async function fetchLastTrack() {
  try {
    const response = await fetch(
      "https://lastfm-last-played.biancarosa.com.br/hadi7546/latest-song",
    );
    const data = await response.json();
    const track = data.track;

    const trackElement = document.getElementById("lastfm-track");

    const image =
      track.image.find((img) => img.size === "extralarge") ||
      track.image.find((img) => img.size === "large") ||
      track.image[track.image.length - 1];

    const isNowPlaying = track["@attr"] && track["@attr"].nowplaying === "true";
    const playStatus = isNowPlaying ? "Now playing" : track.date["#text"];

    trackElement.innerHTML = `
            <div class="track-info">
                <img src="${image["#text"]}" alt="Album cover" class="album-cover" onerror="this.style.display='none'">
                <div class="track-details">
                    <a class="track-name" href="${track.url}" target="_blank">${track.name}</a>
                    <div class="artist-name">by ${track.artist["#text"]}</div>
                    <div class="album-name">from ${track.album["#text"]}</div>
                    <div class="play-date">${playStatus}</div>
                </div>
            </div>
        `;
  } catch (error) {
    console.error("Error fetching Last.fm data:", error);
    document.getElementById("lastfm-track").innerHTML =
      '<div class="error">Unable to load track information</div>';
  }
}

document.addEventListener("DOMContentLoaded", fetchLastTrack);

setInterval(fetchLastTrack, 30 * 1000);
