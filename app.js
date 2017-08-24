/*
If you cant read README.md

This is single file aplication because multiple files would be bad to manage.

# A cool discord bot

## How to use
> npm install
> touch config.js

## In config.js
```JavaScript
module.exports = {
  token: 'token for your bot',
  owner: 'your discord id'
}
```
*/

// Import config file
const config = require('./config');

// Import required dependencies
const Discord = require("discord.js");
const chalk = require('chalk');

// Create a new Discord Client
const client = new Discord.Client();

let minitest = 0;

// List of the commands that the bot can do
// List must contain a object with the name of the command, a description
// and a function that will execute the command, with the parameters:
// command: the array of string received from message listener
// msg: the msg object from discord.js library
const commands = [{
    name: 'echo',
    description: 'Resend the message that you gave (Note: the bot will not' +
      ' echo recursively)',
    response: (command, msg) => {
      command.shift();
      command.shift();
      message = command.join(" ");
      console.log(message);
      if (message == "")
        message = 'Not enough parameters xd';
      sendMessage(msg, message);
    }
  },
  {
    name: 'github',
    description: 'Shows bot source code on github',
    response: (command, msg) => {
      let message = 'You can find the source at: ' +
        ' https://github.com/eldemonstro/dawnbot';
      sendMessage(msg, message);
    }
  },
  {
    name: 'eval',
    description: "Evaluate a javascript code, must be put in one line" +
      "code (between backticks (\`))",
    response: (command, msg) => {
      console.log(minitest);
      command.shift();
      command.shift();
      evaluation = command.join(" ");
      evaluation = /`(.*?)`/g.exec(evaluation);
      let message;
      if (message == null)
        message = 'Not enough parameters xd';
      let geval = eval;
      try {
        message = geval(evaluation[1]);
      } catch (e) {
        if (e instanceof SyntaxError) {
          message = e.message;
        } else {
          throw (e);
        }
      }
      sendMessage(msg, message);
    }
  },
  {
    name: 'help',
    description: 'Shows this list',
    response: (command, msg) => {
      let message = `\`\`\`\nThe commands are:
-------------
${commands.map(cmd => `Name: ${cmd.name}
Description: ${cmd.description}
-------------`).join(`\n`)}
\`\`\``;
      sendMessage(msg, message);
    }
  },
  {
    name: `roll`,
    description: 'Rolls a dice',
    response: (command, msg) => {
      let message;
      if (command.length == 2) {
        message = Math.floor((Math.random() * 6) + 1);
      } else {
        message = Math.floor((Math.random() * parseInt(command[2])) + 1);
      }
      if (message == null) {
        message = `Not enough parameters`;
      }
      sendMessage(msg, message);
    }
  },
  {
    name: `RPG`,
    description: `Testando`,
    response: (command, msg) => {
      RPGHelp.running = true;
      let message = `\`\`\`\nBOW DOWN TO THE:
-------------
${RPGHelp.bosses.map(boss => `Name: ${boss.name}
Life: ${boss.life}
Attacks:
${boss.attacks.map(attack => `Name: ${attack.name} | Damage: ${attack.damage}`).join(`\n`)}
~~~~~~~~~~~~~`).join(`\n`)}
Your party:
-------------
${RPGHelp.players.map(player => `Name: ${player.name}
Life: ${player.life}
Attacks:
${player.attacks.map(attack => `Name: ${attack.name} | Damage: ${attack.damage}`).join(`\n`)}
~~~~~~~~~~~~~`).join(`\n`)}
Do your move:
\`\`\``;
      sendMessage(msg, message);
    }
  }
];

// Sends a response to a channel
// msg: Message object from discord.js
// message: message to be sent
let sendMessage = (msg, message) => {
  msg.channel.send(message)
    .then(message => console.log(`Sent message: ${message.content}`))
    .catch(console.error);
}

let rpg = (msg) => {
  let command = msg.content.split(/\s+/g) || [];
  console.log(command);
  let message;
  findAName(RPGHelp.players, command[0], (found, player) => {
    console.log(player);
    if (!found) {
      sendMessage(msg, "Not found");
    }
  });
}

let RPGHelp = {
  bosses: [{
    name: 'The dark inquisitor',
    life: 20,
    attacks: [{
      name: 'melee',
      damage: 20
    }]
  }],
  players: [{
    name: 'Mage',
    life: 20,
    attacks: [{
      name: 'melee',
      damage: 5
    }]
  }],
  running: false
};

// Find a thing in a array of objects
let findAName = (arr, search, callback) => {
  for (var i = 0; i < arr.length; i++) {
    if (search == arr[i].name) {
      callback(true, arr[i]);
      return;
    }
  }
  callback(false, null);
}

// Find if the command exists and return the obj that contais the command
let findCommand = (command, callback) => {
  for (var i = 0; i < commands.length; i++) {
    if (commands[i].name === command) {
      callback(true, commands[i]);
      return;
    }
  }
  callback(false, {});
}

// Execute when the bot in logged in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

// When the bot see a message execute this (for normal commands)
client.on('message', msg => {
  // If the message comes from the bot itself ignore
  if (client.user.id === msg.author.id) {
    return;
  }

  if (RPGHelp.running == true) {
    rpg(msg);
  }

  // Divide the commands by whitespace
  let command = msg.content.split(/\s+/g) || [];

  // Log the command and the user who used it
  console.log(chalk.blue(command));
  console.log(chalk.green(msg.author.id));

  // Checks if the message is directly to the bot
  if (command[0] === "!db") {
    // Find the required command, if exists execute, if report that the command
    // not exist
    findCommand(command[1], (found, object) => {
      if (!found) {
        msg.channel.send("Command not found :x");
        return;
      }
      object.response(command, msg);
    });
  }
});



client.login(config.token);
