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
      if (message == "") {
        msg.channel.send(`Not enough parameters`)
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);
        return;
      }
      msg.channel.send(message)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
    }
  },
  {
    name: 'github',
    description: 'Shows bot source code on github',
    response: (command, msg) => {
      msg.channel.send('You can find the source at: ' +
          ' https://github.com/eldemonstro/dawnbot')
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
    }
  },
  {
    name: 'eval',
    description: `Evaluate a javascript code, must be put in one line \
    code (between backticks (\`))`,
    response: (command, msg) => {
      console.log(minitest);
      command.shift();
      command.shift();
      evaluation = command.join(" ");
      let message = /`(.*?)`/g.exec(evaluation);
      if (message == null) {
        msg.channel.send(`Not enough parameters`)
          .then(message => console.log(`Sent message: ${message.content}`))
          .catch(console.error);
        return;
      }
      let geval = eval;
      msg.channel.send(geval(message[1]))
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
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
      msg.channel.send(message)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
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
      msg.channel.send(message)
        .then(message => console.log(`Sent message: ${message.content}`))
        .catch(console.error);
    }
  }
];

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
