document.addEventListener("DOMContentLoaded", () => {
  fetchLiveMatches();
  fetchUpcomingMatches();
  fetchLastMatches();
});

const API_KEY = "5e422a278a8842ffbe6d60a2e4e14ae3"; // 👈 Your Football-Data API key

function fetchLiveMatches() {
  fetch("https://api.football-data.org/v4/teams/64/matches?status=IN_PLAY", {
    headers: { "X-Auth-Token": API_KEY }
  })
    .then(response => response.json())
    .then(data => {
      const matches = data.matches || [];
      const liveSection = document.getElementById("liveSection");
      const container = document.getElementById("liveMatchesList");
      container.innerHTML = "";

      if (matches.length === 0) {
        liveSection.style.display = "none"; // 🔥 Hide if no live match
        return;
      }

      liveSection.style.display = "block";

      matches.forEach(match => {
        const matchElement = createMatchElement(match, "LIVE");
        container.appendChild(matchElement);
      });
    })
    .catch(err => {
      console.error("Error fetching live matches:", err);
      document.getElementById("liveSection").style.display = "none";
    });
}

function fetchUpcomingMatches() {
  fetch("https://api.football-data.org/v4/teams/64/matches?status=SCHEDULED&limit=5", {
    headers: { "X-Auth-Token": API_KEY }
  })
    .then(response => response.json())
    .then(data => {
      const matches = data.matches || [];
      const container = document.getElementById("matchesList");
      container.innerHTML = "";

      matches.forEach(match => {
        const matchElement = createMatchElement(match, "UPCOMING");
        container.appendChild(matchElement);
      });
    })
    .catch(err => {
      console.error("Error fetching upcoming matches:", err);
      document.getElementById("matchesList").innerHTML = "<p>Error loading upcoming matches.</p>";
    });
}

function fetchLastMatches() {
  fetch("https://api.football-data.org/v4/teams/64/matches?status=FINISHED&limit=5", {
    headers: { "X-Auth-Token": API_KEY }
  })
    .then(response => response.json())
    .then(data => {
      const matches = data.matches || [];
      const container = document.getElementById("lastMatchesList");
      container.innerHTML = "";

      matches.reverse().forEach(match => { // 🔥 Show newest finished match first
        const matchElement = createMatchElement(match, "FINISHED");
        container.appendChild(matchElement);
      });
    })
    .catch(err => {
      console.error("Error fetching last matches:", err);
      document.getElementById("lastMatchesList").innerHTML = "<p>Error loading past matches.</p>";
    });
}

function createMatchElement(match, matchType) {
  const div = document.createElement("div");
  div.className = `match-card ${matchType === "LIVE" ? "match-live" : (matchType === "FINISHED" ? "match-finished" : "match-upcoming")}`;

  const matchRow = document.createElement("div");
  matchRow.className = "match-teams";

  const homeTeam = match.homeTeam.name;
  const awayTeam = match.awayTeam.name;
  const isHomeTeam = true
  const homeTeamBlock = createTeamBlock(homeTeam, isHomeTeam, true);
  const awayTeamBlock = createTeamBlock(awayTeam, isHomeTeam, false);

  const center = document.createElement("div");
  center.className = "match-center-text";

  if (matchType === "LIVE") {
    const homeGoals = match.score.fullTime.home ?? "-";
    const awayGoals = match.score.fullTime.away ?? "-";
    center.innerHTML = `<span style="color: red;">LIVE</span><br>${homeGoals} - ${awayGoals}`;
  } else if (matchType === "FINISHED") {
    const homeGoals = match.score.fullTime.home ?? "-";
    const awayGoals = match.score.fullTime.away ?? "-";
    center.innerHTML = `${homeGoals} - ${awayGoals}`;
  } else {
    center.innerHTML = "vs";
  }

  matchRow.appendChild(homeTeamBlock);
  matchRow.appendChild(center);
  matchRow.appendChild(awayTeamBlock);

  const dateDiv = document.createElement("div");
  dateDiv.className = "match-date";
  dateDiv.textContent = new Date(match.utcDate).toLocaleDateString();

  div.appendChild(matchRow);
  div.appendChild(dateDiv);

  // 🛠️ Make entire match card clickable
  div.style.cursor = "pointer"; // ✅ Add pointer cursor
  div.addEventListener("click", () => {
    const searchQuery = `${homeTeam} vs ${awayTeam} news`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(searchQuery)}`;
    chrome.tabs.create({ url: searchUrl });
  });

  return div;
}

// 🛠️ Helper: Creates left/right team blocks with icon
function createTeamBlock(teamName, isHomeTeam, isHomeTeam) {
  const container = document.createElement("div");
  container.className = isHomeTeam ? "team-left" : "team-right";

  const label = createTeamLabel(teamName);
  container.appendChild(label);

  if (isHomeTeam) {
    const iconWrapper = createTeamIcon();
    container.appendChild(iconWrapper);
  }

  return container;
}

// Creates team name label
function createTeamLabel(name) {
  const label = document.createElement("div");
  label.className = "team-label";
  label.innerHTML = `<strong>${name}</strong>`;
  return label;
}

// Creates icon
function createTeamIcon() {
  const wrapper = document.createElement("div");
  wrapper.className = "icon-wrapper";

  const icon = document.createElement("img");
  icon.src = "icon.png"; // adjust path if needed
  icon.className = "team-icon";

  wrapper.appendChild(icon);
  return wrapper;
}
