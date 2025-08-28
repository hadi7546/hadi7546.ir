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

async function fetchLastCommit() {
  try {
    const response = await fetch(
      "https://api.github.com/users/hadi7546/events",
    );
    const data = await response.json();

    const pushEvent = data.find((event) => event.type === "PushEvent");

    if (pushEvent) {
      const commit = pushEvent.payload.commits[0];
      const repo = pushEvent.repo.name.split("/")[1];
      const repoUrl = `https://github.com/${pushEvent.repo.name}`;
      const date = new Date(pushEvent.created_at).toLocaleDateString();
      const repoImageUrl = `https://opengraph.githubassets.com/1/${pushEvent.repo.name}`;

      const commitElement = document.getElementById("github-commit");

      commitElement.innerHTML = `
        <div class="commit-info">
          <div class="commit-details">
            <a class="commit-message" href="${commit.url.replace("api.github.com/repos", "github.com").replace("/commits/", "/commit/")}" target="_blank">${commit.message.split("\n")[0]}</a>
            <div class="commit-repo">in <a href="${repoUrl}" target="_blank">${repo}</a></div>
            <div class="commit-date">${date}</div>
          </div>
        </div>
      `;
    }
  } catch (error) {
    console.error("Error fetching GitHub data:", error);
    document.getElementById("github-commit").innerHTML =
      '<div class="error">Unable to load commit information</div>';
  }
}

document.addEventListener("DOMContentLoaded", () => {
  fetchLastTrack();
  fetchLastCommit();
});

setInterval(fetchLastTrack, 30 * 1000);
setInterval(fetchLastCommit, 60 * 1000);
