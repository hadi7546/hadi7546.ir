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
                    <a class="track-name" href="${track.url}" target="_blank">${track.name}</a>
                    <div class="artist-name">by ${track.artist["#text"]}</div>
                    <div class="album-name">from ${track.album["#text"]}</div>
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
      "https://api.github.com/users/hadi7546/events",
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
            <a class="commit-message" href="${commit.url.replace("api.github.com/repos", "github.com").replace("/commits/", "/commit/")}" target="_blank">${commit.message.split("\n")[0]}</a>
            <div class="commit-repo">in <a href="${repoUrl}" target="_blank">${repo}</a></div>
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
        : test.mode + time.mode2;
    testElement.innerHTML = `
      <div class="test-info">
        <div class="test-details">
          <div class="test-wpm">${test.wpm} WPM</div>
          <div class="test-accuracy">${test.acc}% accuracy</div>
          <div class="test-mode">${modeDisplay}</div>
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

document.addEventListener("DOMContentLoaded", () => {
  fetchLastTrack();
  fetchLastCommit();
  fetchLastTypeTest();
});

setInterval(fetchLastTrack, 30 * 1000);
setInterval(fetchLastCommit, 60 * 1000);
setInterval(fetchLastTypeTest, 60 * 1000);

const activities = [
  { title: "Last played:", contentId: "lastfm-track" },
  { title: "Last commit:", contentId: "github-commit" },
  { title: "Last typing test:", contentId: "monkeytype-test" },
];

let currentActivityIndex = 0;

function switchActivity(index) {
  activities.forEach((_, i) => {
    const element = document.getElementById(activities[i].contentId);
    if (element) {
      element.classList.toggle("active", i === index);
    }
  });

  const titleElement = document.getElementById("activity-title");
  if (titleElement) {
    titleElement.textContent = activities[index].title;
  }

  currentActivityIndex = index;
}

function nextActivity() {
  const nextIndex = (currentActivityIndex + 1) % activities.length;
  switchActivity(nextIndex);
}

function prevActivity() {
  const prevIndex =
    (currentActivityIndex - 1 + activities.length) % activities.length;
  switchActivity(prevIndex);
}

document.addEventListener("DOMContentLoaded", () => {
  const nextBtn = document.getElementById("next-btn");
  const prevBtn = document.getElementById("prev-btn");

  if (nextBtn) nextBtn.addEventListener("click", nextActivity);
  if (prevBtn) prevBtn.addEventListener("click", prevActivity);

  switchActivity(0);
});
