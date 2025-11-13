console.log('script.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    const startBtn2 = document.querySelector('.start-btn2');
    const popupInfo2 = document.querySelector('.popup-info2');
    const exitBtn2 = document.querySelector('.exit-btn2');
    const continueBtn2 = document.querySelector('.continue-btn2');
    const main = document.querySelector('main');

     startBtn2 && (startBtn2.onclick = () => {
        popupInfo2 && popupInfo2.classList.add('active');
        main && main.classList.add('active');
    });

    exitBtn2 && (exitBtn2.onclick = () => {
        popupInfo2 && popupInfo2.classList.remove('active');
        main && main.classList.remove('active');
    });

}); 


function calculateResult() {
  const answers = document.querySelectorAll('input[type="radio"]:checked');
  if (answers.length < 10) {
    alert("Please answer all the questions!");
    return;
  }

  // Step 1: Count the number of selections per field
  const scores = { science: 0, technology: 0, engineering: 0, math: 0 };
  answers.forEach(a => {
    if (scores[a.value] !== undefined) {
      scores[a.value]++;
    }
  });

  // Step 2: Find the highest score
  const values = Object.values(scores);
  const maxScore = Math.max(...values);

  // Step 3: Find which fields have that top score
  const topFields = Object.keys(scores).filter(key => scores[key] === maxScore);

  // Step 4: Get DOM elements
  const popupResultText = document.getElementById('popupResultText');
  const resultPopup = document.getElementById('resultPopup');
  const main = document.querySelector('main');

  let message = "";

  // ✅ Step 5: Handle multiple outcomes
  if (topFields.length >= 3) {
    // --- 3 or 4 tied ---
    message = `🌈 You’re a <strong>STEM Superstar!</strong><br>
      You have a brilliant balance of curiosity, creativity, logic, and innovation — 
      a true all-rounder who can shine in any STEM field!`;
  } 
  else if (topFields.length === 2) {
    // --- 2 tied ---
    const fieldsList = topFields
      .map(f => f.charAt(0).toUpperCase() + f.slice(1))
      .join(" & ");
    message = `🌟 You’re a blend of <strong>${fieldsList}</strong>!<br>
      You have a unique mix of skills and interests that span multiple STEM fields — 
      you think creatively, solve problems logically, and love exploring different perspectives.`;
  } 
  else if (topFields.length === 1) {
    // --- 1 clear top field ---
    const topField = topFields[0];
    switch (topField) {
      case "science":
        message = "🔬 You’re a <strong>Scientist at heart!</strong><br>You love exploring the world, asking questions, and discovering how things work. Fields like biology, chemistry, or environmental science might be perfect for you!";
        break;
      case "technology":
        message = "💻 You’re a <strong>Tech Innovator!</strong><br>You enjoy creating digital tools and experimenting with code. You might thrive in computer science, app development, or robotics.";
        break;
      case "engineering":
        message = "⚙️ You’re an <strong>Engineer!</strong><br>You love building, designing, and improving things. Mechanical, civil, or electrical engineering could be your calling!";
        break;
      case "math":
        message = "🧮 You’re a <strong>Math Mind!</strong><br>Logical, analytical, and precise — you could excel in data science, finance, or research.";
        break;
    }
  } 
  else {
    // --- Fallback (should never happen) ---
    message = "Hmm... something went wrong. Try the quiz again!";
  }

  // Step 6: Show popup
  popupResultText.innerHTML = message;
  resultPopup.style.display = "flex";
  main.classList.add("blur");
}
    function closePopup() {
    document.getElementById('resultPopup').style.display = 'none';
    document.querySelector('main').classList.remove('blur');
}

function tryAgain() {
  // Close popup
  document.getElementById('resultPopup').style.display = 'none';
  document.querySelector('main').classList.remove('blur');

  // Clear all selected answers
  const radios = document.querySelectorAll('input[type="radio"]');
  radios.forEach(radio => radio.checked = false);

  // Optionally scroll to top of quiz
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function exitPopup() {
  // Close popup
  document.getElementById('resultPopup').style.display = 'none';
  document.querySelector('main').classList.remove('blur');

  // Optional: scroll to top or redirect
  window.location.href = "Quiz.html";
}