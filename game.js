"use strict";

var Player = require("./player.js");
var prompt = require('prompt-sync')();
const endPatt = new RegExp("quit");

class Game {
  constructor(initial_money) {
    this.player = new Player(this.getName(), initial_money);
    do {
      this.turn();
    } while(!this.endGame());
  }
  
  getName() {
    return prompt("What's your name?  ");
  }

  getGuess() {
    var guess;
    do {
      guess = prompt("What's your guess? Pick an integer betweem 1 and 10.  ");
      if (endPatt.test(guess)) return process.exit();
      guess = parseInt(guess);
    } while(!this.guessValid(guess));
    console.log("The number guessed is " + guess);
    return guess;
  }

  guessValid(guess) {
    return Number(guess) === guess && 
            guess % 1 ===0 && 
            guess <= 10 && 
            guess >= 1;
  }

  getBet() {
    var bet;
    do {
      console.log("How much faith are you putting in your guess?");
      bet = prompt("Number may be a decimal. Needs to be between 5 and 10 and less than bankroll.  ");
      if (endPatt.test(bet)) return process.exit();
      bet = parseFloat(bet);
    } while(!this.betValid(bet));
    this.player.bankroll -= bet;
    return bet;
  }

  betValid(bet) {
    return Number(bet) === bet && 
            bet >= 5 && 
            bet <= 10 && 
            bet <= this.player.bankroll;
  }

  endGame() {
    return this.player.bankroll < 5.0;
  }

  getRandomNum() {
    return Math.floor((Math.random() * 10) + 1);
  }

  getPrize(guess, num, bet) {
    let diff = Math.abs(guess - num);
    switch(diff) {
      case 0: return 2*bet;
      case 1: return bet;
      default: return 0;
    }
  }

  logStatus(turnNum, prize) {
    console.log("The number is...");
    console.log(turnNum + " !!!");
    console.log("In this turn, the outcome is " + prize);
  }

  turn() {
    let turnNum = this.getRandomNum();
    let guess = this.getGuess();
    let bet = this.getBet();
    let prize = this.getPrize(guess, turnNum, bet)
    this.logStatus(turnNum, prize);
    this.player.bankroll += prize;
    console.log("You have now " + this.player.bankroll);
  }
}

module.exports = Game;
