colorlist = ["#FF3F3F", // Red
    "rgb(231, 19, 19)",
    "rgb(253, 167, 38)", // Orange
    "hsl(210, 100%, 50%)", // Teal
    "hsl(210, 100%, 75%)", // Light Blue
    "hsl(60, 100%, 77.10%)", // Yellow 
    "hsl(0, 0%, 50%)", // Gray
    "hsl(30, 100%, 50%)", // Light Orange
    "rgb(171, 120, 68)",
    "rgb(11, 173, 11)",
]
loadfirst = true;
let sortValue = 1;
let deleteAfter = false;
let resetAllowed = false;
let occurences = true; // autorise les répétitions par défaut
let lastone = "";       // dernière valeur tirée
storedOccurences = String(localStorage.getItem("repparam"));
storedSortValue = String(localStorage.getItem("sortValue"));
storeddeleteAfter = String(localStorage.getItem("deleteAfter"));

const versionlog = "MakeAChoice - v0.0.1"
Credit = [
    " Luka MARQUET - Director of project",
]



function random() {
    let x = 0;
    const sortValue = parseInt(localStorage.getItem("sortValue")) || 1;
    const occurences = localStorage.getItem("repparam") === "true";
    const choices = Array.from(document.querySelectorAll(".choice input[type='text']"))
        .map(input => input.value.trim())
        .filter(value => value !== "");

    if (choices.length < 2) {
        error("Please add at least two choices before randomizing.");
        markEmptyInputs();
        document.querySelector('.needInput').setCustomValidity("Please fill in the field");
        document.querySelector('.needInput').reportValidity();
        return;
    }

    document.querySelector('.resultcontainer').style.display = "none";
    document.querySelector('.error').classList = ('error');

    while (x < sortValue) {
        let randomChoice = choices[secureRandom(choices.length)];

        if (!occurences && choices.length > 1) {
            let tries = 0;
            while (randomChoice === lastone && tries < 100) {
                randomChoice = choices[secureRandom(choices.length)];
                tries++;
            }
        }

        lastone = randomChoice;

        const now = new Date();
        const time = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
        const daytime = now.toString();

        const questionText = document.getElementById("questionText").value.trim();
        document.getElementById("lastTime").textContent = `Last : ${time}`;

        console.log("Sort : " + randomChoice);
        console.log("In : " + choices);
        if (questionText !== "") console.log("For : " + questionText);
        console.log("Date : " + daytime);
        console.log("Number : "+(x+1)+"/"+sortValue)
        console.log("-----------------------");

        let resultMessage = "";
        if (questionText === "") {
            resultMessage = `Random choice: ${randomChoice}`;
        } else if (questionText.endsWith("?")) {
            resultMessage = `${questionText} : ${randomChoice}`;
        } else {
            resultMessage = `${questionText} ? : ${randomChoice}`;
        }

        document.getElementById("resultText").textContent = resultMessage;
        document.querySelector('.resultcontainer').style.display = "block";

        // Animation
        const resultContainer = document.querySelector('.resultcontainer');
        resultContainer.classList.add('vibrate');
        resultContainer.addEventListener('animationend', () => {
            resultContainer.classList.remove('vibrate');
        }, { once: true });

        window.scrollTo({
            top: resultContainer.offsetTop,
            behavior: 'smooth'
        });

        x++;
    }
}
function secureRandom(max) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
}





function addchoice(number) {
    let numberstr = document.getElementById('nbaddwarning').value;
    if (number < 1) {
        error("Cannot add less than 1");
        document.getElementById('nbaddwarning').value = 1;
        return;
    } else if (number > 1000){
        error("Cannot add more than 1000 by 1000");
        document.getElementById('nbaddwarning').value = 1000;
        return;
    } else if (numberstr === ""){
        error("Action not possible, value is not a number");
        document.getElementById('nbaddwarning').value = 2;
        return;
    };

    let x = 0;
    let lastAdded = null; // Pour garder le dernier élément ajouté

    while (x < number) {
        document.querySelector('.warning').style.display = "none";
        document.querySelector('.error').className = 'error';

        const choicesContainer = document.querySelector(".choices");

        const newChoice = document.createElement("div");
        newChoice.className = "choice";

        const input = document.createElement("input");
        input.type = "text";
        input.placeholder = "Choice " + (choicesContainer.children.length);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = function () {
            deleteChoice(this);
        };

        const randomColor = colorlist[Math.floor(Math.random() * colorlist.length)];
        if (loadfirst) {
            newChoice.style.backgroundColor = "rgb(132, 132, 132)";
            input.value = "Choice " + (choicesContainer.children.length);
        } else {
            newChoice.style.backgroundColor = randomColor;
        }

        const inputcolor = document.createElement("input");
        inputcolor.type = "color";
        inputcolor.title = "Choose color for this choice";

        inputcolor.value = rgbToHex(newChoice.style.backgroundColor);

        inputcolor.onchange = function () {
            newChoice.style.backgroundColor = this.value;
        };

        newChoice.appendChild(input);
        newChoice.appendChild(deleteBtn);
        newChoice.appendChild(inputcolor);

        choicesContainer.appendChild(newChoice);
        lastAdded = newChoice; // garde en mémoire le dernier ajouté

        x++;
    }

    if (lastAdded) {
        lastAdded.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    loadfirst = false;
}
function rgbToHex(rgb) {
    if (rgb.startsWith("#")) return rgb;
    const result = rgb.match(/\d+/g);
    if (!result) return "#FFFFFF";
    return "#" + result.map(x => {
        const hex = parseInt(x).toString(16);
        return hex.length === 1 ? "0" + hex : hex;
    }).join("");
}





function deleteChoice(button) {
    button.parentElement.remove();
    const choices = document.querySelectorAll(".choice input[type='text']");
    if (choices.length === 0) {
        document.querySelector('.warning').style.display = "flex"
    }
}





function markEmptyInputs() {
    const inputs = document.querySelectorAll(".choice input[type='text']");
    
    inputs.forEach(input => {
        if (input.value.trim() === "") {
            input.classList.add("needInput");
        } else {
            input.classList.remove("needInput");
        }
    });
}





function updateColor() {
    const choices = document.querySelectorAll(".choice");
    choices.forEach((choice, index) => {
        const colorInput = choice.querySelector("input[type='color']");
        if (colorInput) {
            choice.style.backgroundColor = colorInput.value;
        } else {
            choice.style.backgroundColor = colorlist[index % colorlist.length];
        }
    });
}









window.addEventListener("beforeunload", function (e) {
    if (!resetAllowed) {
        e.preventDefault();
        e.returnValue = 'sur ?'; 
    }
});
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();  // On empêche le comportement par défaut du navigateur
        random();
    }
});
document.addEventListener("DOMContentLoaded", function() {
    addchoice(2);
});
window.addEventListener("beforeunload", function (e) {
    if (!resetAllowed) {
        e.preventDefault();
        e.returnValue = '';
    }
});
function resetChoices() {
    if (confirm("Are you sure you want to reload the page?")) {
        resetAllowed = true;
        location.reload();
    }
}
window.addEventListener("scroll", function() {
    const backToTopButton = document.getElementById("backToTop");
    if (window.scrollY > 100) { // quand on descend de 100px
        backToTopButton.style.display = "block";
    } else {
        backToTopButton.style.display = "none";
    }
});





function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}





function error(text) {
    document.querySelector('.error').classList.add('active');
    document.getElementById("errormessage").textContent = ` ${text}`;
    errorTimeout = setTimeout(() => {
        closeError();
    }, 3000);
    // Si la souris entre, on annule le timer
    document.querySelector('.error').addEventListener("mouseenter", () => {
        clearTimeout(errorTimeout);
    });

    // Si la souris quitte, on relance un nouveau timer
    document.querySelector('.error').addEventListener("mouseleave", () => {
        errorTimeout = setTimeout(() => {
            closeError();
        }, 3000);
    });
} 
function success(text) {
    document.querySelector('.success').classList.add('active');
    document.getElementById("successmessage").textContent = ` ${text}`;
    successTimeout = setTimeout(() => {
        closeSuccess();
    }, 3000);
    // Si la souris entre, on annule le timer
    document.querySelector('.success').addEventListener("mouseenter", () => {
        clearTimeout(successTimeout);
    });

    // Si la souris quitte, on relance un nouveau timer
    document.querySelector('.success').addEventListener("mouseleave", () => {
        successTimeout = setTimeout(() => {
            closeSuccess();
        }, 3000);
    });
} 
function closeError() {
    document.querySelector('.error').classList = ('error');
    clearTimeout(errorTimeout);
}
function closeSuccess() {
    document.querySelector('.success').classList = ('success');
    clearTimeout(successTimeout);
}





function openparam() {
    document.querySelector('.backparameters').style.display = "block";
    document.querySelector('.parameters').style.display = "grid";
    verifysave();
}
function closeparam() {
    document.querySelector('.backparameters').style.display = "none";
    document.querySelector('.parameters').style.display = "none";
}
function resetParam() {
    document.getElementById("sortValue").value = 1;
    document.getElementById("repparam").checked = true;
    document.getElementById("deleteAfter").checked = false;
    occurencesCheckbox = document.getElementById("repparam");
    sortValueInput = document.getElementById("sortValue");
    deleteAfterInput = document.getElementById("deleteAfter");

    occurences = occurencesCheckbox.checked;
    deleteAfter = deleteAfterInput.checked;
    sortValue = parseInt(sortValueInput.value);

    localStorage.setItem("repparam", occurences);
    localStorage.setItem("sortValue", sortValue);
    localStorage.setItem("deleteAfter", deleteAfter);

    storedOccurences = "true";
    storedSortValue = "1";
    storeddeleteAfter = "false";

    document.getElementById("savepara").disabled = true;
    document.getElementById("reipara").disabled = true;

    success("Reset successfully saved.");
}
function saveParam() {
    const occurencesCheckbox = document.getElementById("repparam");
    const sortValueInput = document.getElementById("sortValue");
    const deleteAfterInput = document.getElementById("deleteAfter");

    occurences = occurencesCheckbox.checked;
    deleteAfter = deleteAfterInput.checked;
    sortValue = parseInt(sortValueInput.value);
    sortValuestr = String(sortValue)

    if (sortValue < 1) {
        error("Unable to set output below 1.");
        document.getElementById('sortValue').value = 1;
        sortValue = 1;
        verifysave();
        return;
    } else if ( sortValue > 1000){
        error("Unable to set output above 1000.");
        document.getElementById('sortValue').value = 1000;
        sortValue = 1000;
        verifysave();
        return;
    } else if (sortValuestr === "NaN"){
        error("The action is not possible, the value is not a number.");
        document.getElementById('sortValue').value = 1;
        sortValue = 1;
        verifysave();
        return;
    };

    localStorage.setItem("repparam", occurences);
    localStorage.setItem("sortValue", sortValue);
    localStorage.setItem("deleteAfter", deleteAfter);

    storedOccurences = String(occurences);
    storeddeleteAfter = String(deleteAfter);
    storedSortValue = String(sortValue);

    document.getElementById("savepara").disabled = true;

    success("Changes updated successfully.");
}
document.getElementById("repparam").addEventListener("change", (e) => {
    verifysave();
});
document.getElementById("sortValue").addEventListener("input", (e) => {
    verifysave();
});
document.getElementById("deleteAfter").addEventListener("change", (e) => {
    verifysave();
});

function verifysave() {
    const currentOccurences = String(document.getElementById("repparam").checked);
    const currentDeleteAfter = String(document.getElementById("deleteAfter").checked);
    const currentSortValue = document.getElementById("sortValue").value;
    
    if (currentDeleteAfter !== storeddeleteAfter ||currentOccurences !== storedOccurences || currentSortValue !== storedSortValue) {
        document.getElementById("savepara").disabled = false;
    } else {
        document.getElementById("savepara").disabled = true;
    }

    if (currentDeleteAfter !== "false" ||currentOccurences !== "true" || currentSortValue !== "1") {
        document.getElementById("reipara").disabled = false;
    } else {
        document.getElementById("reipara").disabled = true;
    }
}




// Chargement
window.addEventListener("DOMContentLoaded", () => {
    console.log(versionlog)
    console.log("By : "+Credit)

    if (storedOccurences !== null) {
        document.getElementById("repparam").checked = storedOccurences === "true";
        occurences = storedOccurences === "true";
    }

    if (storedSortValue !== null) {
        document.getElementById("sortValue").value = storedSortValue;
        sortValue = parseInt(storedSortValue);
    }

    if(storeddeleteAfter !== null) {
        document.getElementById("deleteAfter").checked = storeddeleteAfter === "true";
        destroyChoice = storeddeleteAfter === "true";
    }
});
