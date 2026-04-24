const loadLesson = () => {
  fetch("https://openapi.programming-hero.com/api/levels/all")
    .then((res) => res.json())
    .then((data) => displayLesson(data.data));
};
function pronounceWord(word) {
  const utterance = new SpeechSynthesisUtterance(word);
  utterance.lang = "en-EN"; // English
  window.speechSynthesis.speak(utterance);
}
const removeActive = () => {
  const lessonButtons = document.querySelectorAll(".lesson-btn");
  lessonButtons.forEach((btn) => btn.classList.remove("active"));
};
const createElements = (element) => {
  const htmlElemenets = element.map((el) => `<span class="btn">${el}</span>`);
  return htmlElemenets.join(" ");
};

const manageSpinner = (status) => {
  if (status === true) {
    document.getElementById("spinner").classList.remove("hidden");
    document.getElementById("word-container").classList.add("hidden");
  } else {
    document.getElementById("word-container").classList.remove("hidden");
    document.getElementById("spinner").classList.add("hidden");
  }
};
const loadWordDetail = async (id) => {
  const url = `https://openapi.programming-hero.com/api/word/${id}`;
  const res = await fetch(url);
  const details = await res.json();
  displayWordDetail(details.data);
};

// {
//     "word": "Sincere",
//     "meaning": "সত্‍ / আন্তরিক",
//     "pronunciation": "সিনসিয়ার",
//     "level": 1,
//     "sentence": "He gave a sincere apology.",
//     "points": 1,
//     "partsOfSpeech": "adjective",
//     "synonyms": [
//         "honest",
//         "genuine",
//         "truthful"
//     ],
//     "id": 19
// }

const displayWordDetail = (word) => {
  console.log(word);
  const detailBox = document.getElementById("word-details-container");
  detailBox.innerHTML = ` <div>
            <h1 class="font-semibold text-2xl">
              ${word.word} (<i class="fa-solid fa-microphone-lines"></i>:${word.pronunciation})
            </h1>
          </div>
          <div>
            <h1 class="font-semibold text-xl">Meaning</h1>
            <h1 class="font-medium text-xl">${word.meaning}</h1>
          </div>
          <div>
            <h1 class="font-semibold text-xl">Example</h1>
            <h1 class="text-xl">${word.sentence}</h1>
          </div>
          <div>
            <h1 class="font-semibold text-xl">সমার্থক শব্দ গুলো</h1>
            <div class="">${createElements(word.synonyms)}</div>
          </div>
          <div>
            <button class="btn btn-primary max-w-50">Complete Learning</button>
          </div>`;

  document.getElementById("word_modal").showModal();
};

const loadLevel = (id) => {
  manageSpinner(true);
  const url = `https://openapi.programming-hero.com/api/level/${id}`;
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      removeActive(); //remove all active class
      const btnClick = document.getElementById(`lesson-btn-${id}`);
      btnClick.classList.add("active");
      displayLevelWord(data.data);
    });
};

const displayLevelWord = (words) => {
  //   {
  //     "id": 81,
  //     "level": 1,
  //     "word": "Ball",
  //     "meaning": "বল",
  //     "pronunciation": "বল"
  // }
  const wordContainer = document.getElementById("word-container");
  wordContainer.innerHTML = "";

  if (words.length === 0) {
    wordContainer.innerHTML = `
     <div class="col-span-3 text-center py-10 space-y-5">
          <img class="mx-auto" src="./assets/alert-error.png" alt="" />
          <h3 class="text-sm text-gray-400">
           এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।
          </h3>
          <h2 class="text-4xl font-medium">নেক্সট Lesson এ যান</h2>
        </div>
    `;
    manageSpinner(false);
    return;
  }

  words.forEach((word) => {
    const createElement = document.createElement("div");
    createElement.innerHTML = `
    <div class="bg-white rounded-xl shadow-sm text-center py-10 space-y-6">
          <h2 class="font-bold text-3xl">${word.word ? word.word : "পাওয়া যায় নি"}</h2>
          <p class="font-medium text-xl">Meaning /Pronounciation</p>
          <h3 class="font-semibold text3xl">"${word.meaning ? word.meaning : "অর্থ পাওয়া যায় নি"} /${word.pronunciation ? word.pronunciation : "Pronounciation অর্থ পাওয়া যায় নি"} "</h3>
          <div class="flex justify-between items-center px-10">
            <button onclick="loadWordDetail(${word.id})" class="btn bg-[#1A91ff10] hover:bg-[#1A91ff80]"><i class="fa-solid fa-circle-info"></i></button>
            <button onclick="pronounceWord('${word.word}')" class="btn bg-[#1A91ff10] hover:bg-[#1A91ff80]"><i class="fa-solid fa-volume-high"></i></button>
          </div>
        </div>
    `;
    wordContainer.append(createElement);
  });
  manageSpinner(false);
};

const displayLesson = (lessons) => {
  //   console.log(lessons);
  //   1.get the container and empty
  const levelContainer = document.getElementById("level-container");
  levelContainer.innerHTML = "";
  //   2.get into every lesson
  lessons.forEach((lesson) => {
    // 3.create element
    const btnDiv = document.createElement("div");
    btnDiv.innerHTML = `
      <button
          id="lesson-btn-${lesson.level_no}"
          onclick="loadLevel(${lesson.level_no})"
           class="btn btn-outline btn-primary lesson-btn">
           <i class="fa-solid fa-book-open"></i>lesson -${lesson.level_no}</
       button>
    `;
    // 4.append child
    levelContainer.append(btnDiv);
  });
};
loadLesson();

document.getElementById("btn-search").addEventListener("click", () => {
  removeActive();
  const input = document.getElementById("input-search");
  const searchValue = input.value.trim().toLowerCase();
  console.log(searchValue);
  fetch("https://openapi.programming-hero.com/api/words/all")
    .then((res) => res.json())
    .then((data) => {
      const allWords = data.data;
      console.log(allWords);
      const filterAllWords = allWords.filter((word) =>
        word.word.toLowerCase().includes(searchValue),
      );
      displayLevelWord(filterAllWords);
    });
});
