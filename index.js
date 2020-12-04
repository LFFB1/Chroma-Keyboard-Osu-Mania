
const fs = require("fs");
const readline = require("readline");
const Parser = require("osu-parser");
const { runInContext } = require("vm");
const { timeStamp } = require("console");
const Chroma = require("./ChromaSDK").ChromaSDK;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let beatmaps = [];

Math.mod = (x,y)=>{while (x>y) {x-=y} return x}

function loadBeatmaps() {
    beatmaps = [];
    fs.readdir("./beatmaps", (err, dir) => {
        if (err) throw err;
        let n = 0;
        let didSetup = false;

        let timeout = setTimeout(() => {
            if (n != 0) {
                console.log("something went wrong, not finished loading all beatmaps within 10 seconds");
                console.log("starting up anyway");
                didSetup = true;
                setup();
            }
        }, 10000)

        dir.forEach((fileName, index) => {
            n++;
            Parser.parseFile("./beatmaps/" + fileName, (err, beatmap) => {
                if (err) throw err;
                n--;
                if (beatmap.Mode == 3) {
                    beatmaps.push(beatmap);
                }
                if (n == 0 && !didSetup) {
                    didSetup = true;
                    clearTimeout(timeout);
                    setup();
                }
            }); 
        });
    });
}

function setup() {
    console.log("\n\nWelcome to Keyboard Osu Mania.")
    console.log("Loaded a total of " + beatmaps.length + " beatmaps.\n")

    for (let i = 0; i < beatmaps.length; i++) {
        let beatmap = beatmaps[i];
        let time = beatmap.totalTime;
        let timeDisplay = Math.floor(time/60) + ":" + Math.mod(time, 60);
        console.log((i+1) + " - " + beatmap.Title + " - creator: " + beatmap.Creator + " - artist: " + beatmap.Artist);
        console.log("      " + timeDisplay + " | difficulty: " + beatmap.OverallDifficulty);
    }

    prompt()
}

function prompt() {
    rl.question("\n> ", run);
}

function run(command) {
    if (command == "exit") {
        rl.close();
    } else if (command == "reload") {
        console.log("\nreloading...");
        loadBeatmaps();
    } else if (command == "ping") {
        console.log("pong");
        prompt();
    } else if (command ==  "test") {
        // test sequence
    } else if (command == "info") {
        console.log("\nChroma Keyboard Osu Mania - Made by LFFB");
        console.log("Version 0.0.1");
        prompt();
    } else {
        console.log("Not a valid command");
        prompt();
    }
}

loadBeatmaps()