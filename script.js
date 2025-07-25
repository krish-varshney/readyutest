function shuffleArray(array) {
  for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp; // Fixed typo here, was 'array[i] = array[i]'
  }
}

document.getElementById("quiz-form").addEventListener("submit", function (e) {
e.preventDefault();

const scores = {};
const counts = {};
const responses = {}; // Initialize responses object here

const questions = document.querySelectorAll(".question");

questions.forEach((q) => {
  const category = q.dataset.category;
  const reverse = q.dataset.reverse === "true";
  const questionId = q.querySelector('input[type="radio"]').name; // Get the name attribute (e.g., "q1", "q2")
  const selected = q.querySelector('input[type="radio"]:checked');

  if (!scores[category]) {
    scores[category] = 0;
    counts[category] = 0;
  }

  if (selected) {
    let value = parseInt(selected.value);
    responses[questionId] = value; // Store the response for this question
    if (reverse) value = 6 - value;
    scores[category] += value;
    counts[category]++;
    //console.log(`Category: ${category}, Score: ${scores[category]}, Count: ${counts[category]}`);
  }
});

// Scale scores to 0–100
const scaled = {};
for (let cat in scores) {
  if (counts[cat] > 0) {
    scaled[cat] = ((scores[cat] - counts[cat]) / (4 * counts[cat])) * 100;
  }
}

// Convert the scaled scores object into a sortable array
const sorted = Object.entries(scaled)
  .filter(entry => typeof entry[1] === "number") // filter out any undefined or non-number entries
  .sort((a, b) => b[1] - a[1]); // sort descending by score

// Make sure there are at least 2 categories to select
if (sorted.length >= 2) {
  const top1 = sorted[0][0];
  const top2 = sorted[1][0];

  // Continue with personality typing logic
  console.log("Top two categories:", top1, top2);

  // Archetype lookup
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
    `<b>Highest-scoring category:</b> ${top1}, <b>Second highest-scoring category:</b> ${top2}<br><b>Score Summary:</b> ` +
    sorted.map(([cat, score]) => `${cat}: ${Math.round(score)}`).join(", ");
  document.getElementById("results").style.display = "block";

} else {
  // Handle error gracefully
  alert("Not enough valid category scores to determine result.");
}

document.getElementById("submit-button").style.backgroundColor = "#345491";

// --- START: Backend integration (moved inside the submit event listener) ---
// Replace 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE' with your actual deployed Apps Script URL
const encodedData = encodeURIComponent(JSON.stringify(responses));
const url = "https://script.google.com/macros/s/AKfycbwKzkUClO5lfKM8x8ma-3wA_mKhSwVnq8du0y8V_mOIfsqJlqdTkteVQgwPyjVZ4XQKjw/exec?data=" + encodedData;

fetch(url)
  .then(res => res.json())
  .then(data => console.log("Success:", data))
  .catch(err => console.error("Fetch error:", err));
// --- END: Backend integration ---

});

let questions = [
// analytical
{ text: "I often notice patterns in information that others may miss.",
  id: 'q1', category: "Analytical", reverse: false },
{ text: "When faced with complex data, I quickly spot recurring themes or sequences.",
  id: 'q2', category: "Analytical", reverse: false },
{ text: "I enjoy working through logic puzzles or problems that require step-by-step reasoning.",
  id: 'q3', category: "Analytical", reverse: false },
{ text: "I can usually trace an argument back to its foundational assumptions to verify its validity.",
  id: 'q4', category: "Analytical", reverse: false },
{ text: "I am good with numbers and calculations.",
  id: 'q5', category: "Analytical", reverse: false },
{ text: "I frame problems through mathematical concepts and equations.",
  id: 'q6', category: "Analytical", reverse: false },
{ text: "I seek to thoroughly understand the concepts behind content, sometimes at the expense of time.",
  id: 'q7', category: "Analytical", reverse: false },
{ text: "I naturally think of and seek to understand edge cases outside of the content taught to me.",
  id: 'q8', category: "Analytical", reverse: false },
{ text: "I rarely accept a claim without first looking for supporting data or credible sources.",
  id: 'q9', category: "Analytical", reverse: false },
{ text: "When making decisions, I prefer to rely on facts and statistics rather than personal opinions or perspectives.",
  id: 'q10', category: "Analytical", reverse: false },
// experiential
{ text: "I remember new ideas best when I physically handle or manipulate something related to them.",
  id: 'q11', category: "Experiential", reverse: false },
{ text: "I can often recall how to perform a task by replaying physical motions or remembering details such as texture, movement, or sound.",
  id: 'q12', category: "Experiential", reverse: false },
{ text: "I approach problems by experimenting with several different approaches, even if I may encounter failure.",
  id: 'q13', category: "Experiential", reverse: false },
{ text: "I view mistakes as useful feedback and quickly adjust my strategy after each error.",
  id: 'q14', category: "Experiential", reverse: false },
{ text: "I learn best when I can link a concept to a real-life task or scenario.",
  id: 'q15', category: "Experiential", reverse: false },
{ text: "I often ask how classroom information can be applied outside of school or in everyday situations.",
  id: 'q16', category: "Experiential", reverse: false },
{ text: "I learn best through labs, demonstrations, or field trips rather than through lectures.",
  id: 'q17', category: "Experiential", reverse: false },
{ text: "I more effectively retain content through hands-on experiments than through reading textbooks or listening to presentations.",
  id: 'q18', category: "Experiential", reverse: false },
{ text: "After seeing a demonstration, I would prefer to try it myself immediately rather than ruminating for a long time before taking action.",
  id: 'q19', category: "Experiential", reverse: false },
{ text: "I feel most confident when I can practice a skill right after observing it.",
  id: 'q20', category: "Experiential", reverse: false },
// social
{ text: "Group conversations help me understand course concepts more deeply.",
  id: 'q21', category: "Social", reverse: false },
{ text: "When I encounter a confusing topic, my first instinct is to talk through it with peers.",
  id: 'q22', category: "Social", reverse: false },
{ text: "Explaining material to classmates always helps me solidify my own understanding.",
  id: 'q23', category: "Social", reverse: false },
{ text: "I volunteer to tutor or coach others when they struggle with content I know well.",
  id: 'q24', category: "Social", reverse: false },
{ text: "I learn best when my peers explain concepts to me from the material we were taught.",
  id: 'q25', category: "Social", reverse: false },
{ text: "I can learn key ideas and make breakthroughs just from talking with my peers.",
  id: 'q26', category: "Social", reverse: false },
{ text: "I learn best through collaborative projects rather than through independent work.",
  id: 'q27', category: "Social", reverse: false },
{ text: "I prefer to share ideas and make conclusions collaboratively rather than process ideas and draw conclusions on my own.",
  id: 'q28', category: "Social", reverse: false },
{ text: "Hearing unique anecdotes from others about what we’ve learned often helps me recall key concepts.",
  id: 'q29', category: "Social", reverse: false },
{ text: "I often ask teammates for examples from their experience to clarify new concepts.",
  id: 'q30', category: "Social", reverse: false },
// creative
{ text: "I flourish in academic settings that promote creative idea generation over structured assignments.",
  id: 'q31', category: "Creative", reverse: false },
{ text: "I can quickly come up with many different ideas when solving a problem.",
  id: 'q32', category: "Creative", reverse: false },
{ text: "I often picture vivid images or scenes in my mind when thinking through ideas.",
  id: 'q33', category: "Creative", reverse: false },
{ text: "I learn most effectively by mentally visualizing information.",
  id: 'q34', category: "Creative", reverse: false },
{ text: "I frequently use metaphors or analogies to explain difficult concepts.",
  id: 'q35', category: "Creative", reverse: false },
{ text: "I learn content effectively by comparing ideas I’m studying to concepts from other fields.",
  id: 'q36', category: "Creative", reverse: false },
{ text: "I prefer academic subjects where answers are subjective rather than there being a clear correct answer.",
  id: 'q37', category: "Creative", reverse: false },
{ text: "I feel energized by challenges that require original or unconventional thinking.",
  id: 'q38', category: "Creative", reverse: false },
{ text: "I often imagine alternative possibilities, even when focusing on the most likely outcome to the task at hand would be more beneficial.",
  id: 'q39', category: "Creative", reverse: false },
{ text: "I frequently speculate about different ways a concept can be tested to understand the content better.",
  id: 'q40', category: "Creative", reverse: false },
// organized
{ text: "During lectures, I always keep my notes structured with headings and bullet points.",
  id: 'q41', category: "Organized", reverse: false },
{ text: "Reviewing my thorough notes later gives me most of what I need to study.",
  id: 'q42', category: "Organized", reverse: false },
{ text: "I frequently use checklists or similar tools to help me feel organized when completing multi-step tasks.",
  id: 'q43', category: "Organized", reverse: false },
{ text: "In my day-to-day, I rely on tools like to-do lists, spreadsheets, and schedules to plan nearly everything, sometimes even the most mundane or fun activities.",
  id: 'q44', category: "Organized", reverse: false },
{ text: "I work best when my study sessions are routinely scheduled at the same time(s) each day.",
  id: 'q45', category: "Organized", reverse: false },
{ text: "I am focused and perform best when my study session is highly structured, using methods like the Pomodoro Technique.",
  id: 'q46', category: "Organized", reverse: false },
{ text: "I organize digital files, notes, and/or emails into systematically labeled folders or tags.",
  id: 'q47', category: "Organized", reverse: false },
{ text: "I process information best by organizing concepts into a categorical system.",
  id: 'q48', category: "Organized", reverse: false },
{ text: "I am confident in my ability to organize and thoughtfully complete many tasks within a short time.",
  id: 'q49', category: "Organized", reverse: false },
{ text: "When surrounded by clutter, whether mental or physical, I feel a sense of comfort and fulfillment by sorting through it.",
  id: 'q50', category: "Organized", reverse: false },
];

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