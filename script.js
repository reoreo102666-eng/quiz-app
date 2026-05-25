let quizData = [];
let current = 0;
let score = 0;
let selected = null;
let confidence = null;

// CSV読み込み
fetch("解剖1.csv")
  .then(res => res.text())
  .then(text => {
    parseCSV(text);
    startQuiz();
  });

function parseCSV(text) {
  const lines = text.split("\n").filter(l => l.trim() !== "");

  quizData = lines.map(line => {
    const cols = line.split(",");

    return {
      question: cols[0],
      choices: [cols[1], cols[2], cols[3], cols[4], cols[5]],
      answer: Number(cols[6].replace("選択肢", "")) - 1,
      explanation: cols[7] || ""
    };
  });

  quizData.sort(() => Math.random() - 0.5);
}

function startQuiz() {
  loadQuestion();
}

function loadQuestion() {
  const q = quizData[current];

  document.getElementById("progressText").innerText =
    (current + 1) + " / " + quizData.length;

  document.getElementById("bar").style.width =
    ((current + 1) / quizData.length) * 100 + "%";

  document.getElementById("question").innerText = q.question;

  const choicesDiv = document.getElementById("choices");
  choicesDiv.innerHTML = "";

  q.choices.forEach((c, i) => {
    const div = document.createElement("div");
    div.className = "choice";
    div.innerText = c;

    div.onclick = () => {
      if (selected !== null) return;

      selected = i;

      document.querySelectorAll(".choice").forEach((el, index) => {
        if (index === q.answer) {
          el.style.background = "#4CAF50"; // 正解
          el.style.color = "white";
        } else if (index === selected) {
          el.style.background = "#f44336"; // 不正解
          el.style.color = "white";
        }
      });

      showExplanation(q);
    };

    choicesDiv.appendChild(div);
  });

  const confDiv = document.getElementById("confidence");
  confDiv.innerHTML = "";

  for (let i = 1; i <= 5; i++) {
    const circle = document.createElement("div");
    circle.className = "circle";
    circle.innerText = i;

    circle.onclick = () => {
      document.querySelectorAll(".circle").forEach(el => el.classList.remove("selected"));
      circle.classList.add("selected");
      confidence = i;
    };

    confDiv.appendChild(circle);
  }

  selected = null;
  confidence = null;

  const exp = document.getElementById("explanation");
  if (exp) exp.remove();
}

function showExplanation(q) {
  const div = document.createElement("div");
  div.id = "explanation";
  div.style.marginTop = "15px";
  div.style.padding = "10px";
  div.style.background = "#eee";
  div.innerText = "解説： " + q.explanation;

  document.querySelector(".app").appendChild(div);
}

function nextQuestion() {
  if (selected === null) {
    alert("選択して！");
    return;
  }

  if (confidence === null) {
    alert("自信度も選んで！");
    return;
  }

  if (selected === quizData[current].answer) {
    score++;
  }

  current++;

  if (current < quizData.length) {
    loadQuestion();
  } else {
    document.querySelector(".app").innerHTML = `
      <h2>結果</h2>
      <p>${quizData.length}問中 ${score}問正解！</p>
      <button onclick="location.reload()">もう一回</button>
    `;
  }
}