//Episode information API for The Simpsons: http://api.tvmaze.com/shows/83/episodes


//import SoundBox from "./node_modules/sound-box/soundbox.js";

(function () {
    // Fetch data from api and store it into local storage if it doens't already exist
    var fetchJSON = function () {
        fetch('https://api.tvmaze.com/shows/83/episodes')
            .then((res) => res.json())
            .then(function (rawJSON) {

                localStorage.setItem("simpsonsData", JSON.stringify(rawJSON));
                localStorage.setItem("currentScore", 0)
                localStorage.setItem("episodesPlayed", 0)
                runProgram();
            });
    }

    var runProgram = function () {
        var rawJSON = JSON.parse(localStorage.getItem("simpsonsData"))
        // function to filter json data to  only season 1-10 and only display the required info for the quiz (episode title, season, summary, image)
        var filteredSeasonsArr = filterSeasons(rawJSON);

        // function uses random number generator to choose among the avilable episodes a "target" episode to make the correct episode.
        var randomNumber = randomNumberGen(filteredSeasonsArr)
        var episodeToGuess = randomEpisode(filteredSeasonsArr, randomNumber);

        displayTargetEpisodeInfo(episodeToGuess);

        displaySeasonImages(episodeToGuess);

        checkIfCorrectClicked(episodeToGuess);

        // reset the feedback and the correct season display
        var feedback = document.getElementById("feedback");
        feedback.innerHTML = ``;
        var feedback = document.getElementById("correctSeasonNum");
        correctSeasonNum.innerHTML = ``;
    }

    var filterSeasons = function (rawJSON) {
        var filteredBySeason = rawJSON.filter(episode => episode.season <= 10)
            .map(episode => ({ "name": episode.name, "summary": episode.summary, "season": episode.season, "image": episode.image.medium }));

        return filteredBySeason;
    }

    var randomEpisode = function (filteredSeasonsArr, randomNumber) {
        // return the correct episode data
        return filteredSeasonsArr[randomNumber]
    }

    var displayTargetEpisodeInfo = function (episodeToGuess) {
        var targetEpisodeSumamry = episodeToGuess.summary;
        var targetEpisodeName = episodeToGuess.name;
        var targetEpisodeImage = episodeToGuess.image;

        //isolate the divs
        var targetSummaryDiv = document.getElementById("episodeSummary");
        var targetNameDiv = document.getElementById("episodeName");
        var targetImageDiv = document.getElementById("episodeImage");

        // Write the episode info to the divs
        targetSummaryDiv.innerHTML = targetEpisodeSumamry;
        targetNameDiv.innerHTML = targetEpisodeName;
        targetImageDiv.innerHTML = `<img class="img-fluid mx-auto d-block" src="${targetEpisodeImage}" alt="The Simpson's Logo"></img>`
    }

    var displaySeasonImages = function (episodeToGuess) {
        // isolate the divs to display the season images
        var leftSeasonDiv = document.getElementById("leftSeason");
        var middleSeasonDiv = document.getElementById("middleSeason");
        var rightSeasonDiv = document.getElementById("rightSeason");

        // The right season number comes from the episodeToGuess data. It gets pushed to an array of UNIQUE season numbers. it is unique becuase of
        // of the while loop and if statement that will only push numbers that do not already exist in the array.
        var rightSeasonNum = episodeToGuess.season;

        //Get two random numbers to be the random two incorrect seasons
        var uniqueSeasonNumArr = []
        uniqueSeasonNumArr.push(rightSeasonNum);
        while (uniqueSeasonNumArr.length < 3) {
            var random = Math.floor(Math.random() * 10) + 1;
            if (uniqueSeasonNumArr.indexOf(random) === -1) {
                uniqueSeasonNumArr.push(random);
                console.log()
            }
        }

        var wrongSeasonNumOne = uniqueSeasonNumArr[1];
        var wrongSeasonNumTwo = uniqueSeasonNumArr[2];


        var wrongSeasonImageOne = `images/season${wrongSeasonNumOne}.jpg`;
        var wrongSeasonImageTwo = `images/season${wrongSeasonNumTwo}.jpg`;
        var rightSeasonImage = `images/season${rightSeasonNum}.jpg`

        // Puts the corrrect season in a random spot so its not the same everytime
        var randomPositionNum = Math.floor(Math.random() * 3) + 1;
        if (randomPositionNum === 1) {
            leftSeasonDiv.innerHTML = `<img id="wrongSeasonOne" class="img-fluid mx-auto d-block seasonImage" src="${wrongSeasonImageOne}" alt="season image"></img>`
            middleSeasonDiv.innerHTML = `<img id="wrongSeasonTwo" class="img-fluid mx-auto d-block seasonImage" src="${wrongSeasonImageTwo}" alt="season image"></img>`
            rightSeasonDiv.innerHTML = `<img id="correctSeason" class="img-fluid mx-auto d-block seasonImage" src="${rightSeasonImage}" alt="season image"></img>`
        } else if (randomPositionNum === 2) {
            leftSeasonDiv.innerHTML = `<img id="wrongSeasonOne" class="img-fluid mx-auto d-block seasonImage" src="${wrongSeasonImageOne}" alt="season image"></img>`
            middleSeasonDiv.innerHTML = `<img id="correctSeason" class="img-fluid mx-auto d-block seasonImage" src="${rightSeasonImage}" alt="season image"></img>`
            rightSeasonDiv.innerHTML = `<img id="wrongSeasonTwo" class="img-fluid mx-auto d-block seasonImage" src="${wrongSeasonImageTwo}" alt="season image"></img>`
        } else {
            leftSeasonDiv.innerHTML = `<img id="correctSeason" class="img-fluid mx-auto d-block seasonImage" src="${rightSeasonImage}" alt="season image"></img>`
            middleSeasonDiv.innerHTML = `<img id="wrongSeasonOne" class="img-fluid mx-auto d-block seasonImage" src="${wrongSeasonImageOne}" alt="season image"></img>`
            rightSeasonDiv.innerHTML = `<img id="wrongSeasonTwo" class="img-fluid mx-auto d-block seasonImage" src="${wrongSeasonImageTwo}" alt="season image"></img>`
        }
    }

    var checkIfCorrectClicked = function (episodeToGuess) {
        var correctSeason = document.getElementById("correctSeason");
        var wrongSeasonOne = document.getElementById("wrongSeasonOne");
        var wrongSeasonTwo = document.getElementById("wrongSeasonTwo");
        var feedback = document.getElementById("feedback");
        var correctSeasonNumDiv = document.getElementById("correctSeasonNum");

        var currentScore = parseInt(localStorage.getItem("currentScore"));
        var episodesPlayed = parseInt(localStorage.getItem("episodesPlayed"));

        //Create new SoundBox from library and load the correct (ding) and incorrect (buzz) sounds
        var soundbox = new SoundBox();
        soundbox.load("ding", "sounds/ding.wav").then(
            () => console.log("Loaded ding!"),
            () => console.error("Failed to load ding :-(")
        );
        soundbox.load("buzz", "sounds/buzz.wav").then(
            () => console.log("Loaded buzz!"),
            () => console.error("Failed to load buzz :-(")
        );

        correctSeason.addEventListener("click", function () {
            feedback.innerHTML = `WooHoo!`;
            localStorage.setItem("currentScore", currentScore + 1);
            localStorage.setItem("episodesPlayed", episodesPlayed + 1);
            setScore(currentScore, episodesPlayed);
            correctSeasonNumDiv.innerHTML = `Season ${episodeToGuess.season}`;
            //Play ding sound when user selects correct season
            soundbox.play("ding");
            setTimeout(runProgram, 2000);
        })

        wrongSeasonOne.addEventListener("click", function () {
            feedback.innerHTML = `D'OH!`
            localStorage.setItem("episodesPlayed", parseInt(episodesPlayed) + 1);
            setScore(currentScore, episodesPlayed);
            correctSeasonNumDiv.innerHTML = `Season ${episodeToGuess.season}`;
            //Play buzz sound when user selects the wrong season
            soundbox.play("buzz");
            setTimeout(runProgram, 2000);
        })

        wrongSeasonTwo.addEventListener("click", function () {
            feedback.innerHTML = `D'OH!`
            localStorage.setItem("episodesPlayed", parseInt(episodesPlayed) + 1);
            setScore(currentScore, episodesPlayed);
            correctSeasonNumDiv.innerHTML = `Season ${episodeToGuess.season}`;
            soundbox.play("buzz");
            setTimeout(runProgram, 2000);
        })
    }

    var setScore = function () {
        var score = document.getElementById("score");
        var currentScore = parseInt(localStorage.getItem("currentScore"));
        var episodesPlayed = parseInt(localStorage.getItem("episodesPlayed"));


        score.innerHTML = `${currentScore} out of ${episodesPlayed}`;

    }


    // Random number between 1 and the total amount of episodes in all ten seasons
    var randomNumberGen = function (filteredSeasonsArr) {
        totalNumEpisodes = filteredSeasonsArr.length;
        return randomNum = Math.floor(Math.random() * totalNumEpisodes) + 1;
    }

    fetchJSON();
})();