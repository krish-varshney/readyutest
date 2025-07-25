function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
  }
}

document.getElementById("quiz-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const scores = {};
  const counts = {};
  const responses = {};
  const questions = document.querySelectorAll(".question");

  questions.forEach((q) => {
    const category = q.dataset.category;
    const reverse = q.dataset.reverse === "true";
    const questionId = q.querySelector('input[type="radio"]').name;
    const selected = q.querySelector('input[type="radio"]:checked');

    if (!scores[category]) {
      scores[category] = 0;
      counts[category] = 0;
    }

    if (selected) {
      let value = parseInt(selected.value);
      responses[questionId] = value;
      if (reverse) value = 6 - value;
      scores[category] += value;
      counts[category]++;
    }
  });

  const scaled = {};
  for (let cat in scores) {
    if (counts[cat] > 0) {
      scaled[cat] = ((scores[cat] - counts[cat]) / (4 * counts[cat])) * 100;
    }
  }

  const sorted = Object.entries(scaled)
    .filter(entry => typeof entry[1] === "number")
    .sort((a, b) => b[1] - a[1]);

  if (sorted.length >= 2) {
    const top1 = sorted[0][0];
    const top2 = sorted[1][0];

    const archetypes = {
      "Analytical|Experiential": "Engineer",
      "Analytical|Social": "Strategist",
      "Analytical|Creative": "Innovator",
      "Analytical|Organized": "Architect",
      "Experiential|Social": "Facilitator",
      "Experiential|Creative": "Maker",
      "Experiential|Organized": "Producer",
      "Social|Creative": "Storyteller",
      "Social|Organized": "Coordinator",
      "Creative|Organized": "Designer",
    };

    const key = [top1, top2].sort().join("|");
    const result = archetypes[key] || "You tied on two or more categories.";

    document.getElementById("archetype-name").innerText = result;
    document.getElementById("archetype-desc").innerHTML =
      `<b>Highest-scoring category:</b> ${top1}, <b>Second highest:</b> ${top2}<br><b>Scores:</b> ` +
      sorted.map(([cat, score]) => `${cat}: ${Math.round(score)}`).join(", ");
    document.getElementById("results").style.display = "block";
  } else {
    alert("Not enough answers to determine result.");
  }

  document.getElementById("submit-button").style.backgroundColor = "#345491";

  // === JSONP Submission ===
  const script = document.createElement("script");
  const callbackName = "jsonpCallback_" + Math.floor(Math.random() * 100000);
  window[callbackName] = function (data) {
    console.log("Google Script response:", data);
    delete window[callbackName];
    document.body.removeChild(script);
  };

  const url = "https://script.google.com/macros/s/PASTE_YOUR_DEPLOYED_ID/exec"
    + "?callback=" + callbackName
    + "&data=" + encodeURIComponent(JSON.stringify(responses));

  script.src = url;
  document.body.appendChild(script);
});

// === Question Rendering ===

let questions = [/* your 50-question list, unchanged */];
// for brevity, assume you already have the questions block in place

shuffleArray(questions)

for (let i = 1; i <= 50; i++) {
  const q = questions[i-1];
  const question = document.createElement("div");
  question.className = "question";
  question.dataset.category = q.category;
  question.dataset.reverse = q.reverse;

  question.innerHTML = `
    <p>${i}. ${q.text}</p>
    <div class="likert-scale">
      <label><input type="radio" name="${q.id}" value="1"> Strongly Disagree</label>
      <label><input type="radio" name="${q.id}" value="2"> Disagree</label>
      <label><input type="radio" name="${q.id}" value="3"> Neutral</label>
      <label><input type="radio" name="${q.id}" value="4"> Agree</label>
      <label><input type="radio" name="${q.id}" value="5"> Strongly Agree</label>
    </div>
  `;

  document.getElementById("quiz-container").appendChild(question);
}
