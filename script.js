function formatDate(date) {
  const options = {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  };
  return date.toLocaleDateString(navigator.language, options).replace(/,/, ",");
}

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
    const playStatus = isNowPlaying
      ? "Now playing"
      : formatDate(new Date(track.date.uts * 1000));

    trackElement.innerHTML = `
            <div class="track-info">
                <img src="${image["#text"]}" alt="Album cover" class="album-cover" onerror="this.style.display='none'">
                <div class="track-details">
                    <a class="track-name" href="${track.url}" target="_blank" title="${track.name}">${track.name}</a>
                    <div class="artist-name" title="by ${track.artist["#text"]}">by ${track.artist["#text"]}</div>
                    <div class="album-name" title="from ${track.album["#text"]}">from ${track.album["#text"]}</div>
                    <div class="play-date bright-date">${playStatus}</div>
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
      "https://api.github.com/users/hadi7546/events/public",
    );
    const data = await response.json();

    const pushEvent = data.find((event) => event.type === "PushEvent");

    if (pushEvent) {
      const commit = pushEvent.payload.commits[0];
      const repo = pushEvent.repo.name.split("/")[1];
      const repoUrl = `https://github.com/${pushEvent.repo.name}`;
      const date = formatDate(new Date(pushEvent.created_at));
      const repoImageUrl = `https://opengraph.githubassets.com/1/${pushEvent.repo.name}`;

      const commitElement = document.getElementById("github-commit");

      commitElement.innerHTML = `
        <div class="commit-info">
          <div class="commit-details">
            <a class="commit-message" href="${commit.url.replace("api.github.com/repos", "github.com").replace("/commits/", "/commit/")}" target="_blank" title="${commit.message.split("\n")[0]}">${commit.message.split("\n")[0]}</a>
            <div class="commit-repo" title="in ${repo}">in <a href="${repoUrl}" target="_blank">${repo}</a></div>
            <div class="commit-date bright-date">${date}</div>
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

async function fetchLastTypeTest() {
  try {
    // It's not a secret key.
    const apeKey =
      "NjhiNDE4MzBlZmY2N2M0ZmRjNjE4OTBlLlRHbmVNampEemxnSllFXzc5TW02TVByZ2hlNFp2Q1VU";
    const response = await fetch("https://api.monkeytype.com/results/last", {
      headers: {
        Authorization: `ApeKey ${apeKey}`,
      },
    });
    const data = await response.json();
    const test = data.data;

    const testElement = document.getElementById("monkeytype-test");
    const date = formatDate(new Date(test.timestamp));
    const modeDisplay =
      test.mode === "time"
        ? `${test.mode} ${test.testDuration}s`
        : test.mode + test.mode2;
    testElement.innerHTML = `
      <div class="test-info">
        <div class="test-details">
          <div class="test-wpm">${test.wpm} WPM</div>
          <div class="test-accuracy">${test.acc}% accuracy</div>
          <div class="test-mode">mode: ${modeDisplay}</div>
          <div class="test-date bright-date">${date}</div>
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error fetching MonkeyType data:", error);
    document.getElementById("monkeytype-test").innerHTML =
      '<div class="error">Unable to load test information</div>';
  }
}

function setupMusicPlayer() {
  const musicToggle = document.getElementById("music-toggle");
  const music = document.getElementById("background-music");

  if (musicToggle && music) {
    musicToggle.addEventListener("click", () => {
      if (music.paused) {
        music.play();
        musicToggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>';
      } else {
        music.pause();
        musicToggle.innerHTML =
          '<svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18"><path d="M8 5v14l11-7z"/></svg>';
      }
    });
  }
}

function ensureCursorPersistence() {
  // Force cursor to be reapplied after clicks
  document.addEventListener("click", () => {
    // Small timeout to ensure cursor updates after browser's default behavior
    setTimeout(() => {
      const html = document.querySelector("html");
      const styleAttr = html.getAttribute("style") || "";

      if (!styleAttr.includes("cursor")) {
        // Reapply the cursor from our CSS if it's been lost
        html.style.cursor = "url('public/arrow.cur'), auto";
      }

      // Ensure all clickable elements have the correct cursor
      document
        .querySelectorAll("a, button, .home-link, [role='button']")
        .forEach((el) => {
          const elStyle = el.getAttribute("style") || "";
          if (!elStyle.includes("cursor")) {
            el.style.cursor = "url('public/click.cur'), pointer";
          }
        });
    }, 10);
  });

  // Handle navigation links specially
  document.querySelectorAll("a").forEach((link) => {
    if (link.host === window.location.host) {
      link.addEventListener("click", (e) => {
        const cursorStyle = document.createElement("style");
        cursorStyle.textContent = `* { transition: none !important; }`;
        document.head.appendChild(cursorStyle);
      });
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  setupMusicPlayer();
  ensureCursorPersistence();

  if (document.getElementById("lastfm-track")) {
    fetchLastTrack();
    fetchLastCommit();
    fetchLastTypeTest();

    setInterval(fetchLastTrack, 30 * 1000);
    setInterval(fetchLastCommit, 5 * 60 * 1000);
    setInterval(fetchLastTypeTest, 5 * 60 * 1000);
  }
});
