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

// List of the commands that the bot can do
// The list must contain the name that will be called
// TODO: Convert the list of commands to an list of objects
const commands = [{
  name: 'echo',
  response: (command, msg) => {
    command.shift();
    command.shift();
    message = command.join(" ");
    msg.channel.send(message)
      .then(message => console.log(`Sent message: ${message.content}`))
      .catch(console.error);
  }
}, {
  name: 'github',
  response: (command, msg) => {
    msg.channel.send("You can find the source at: https://github.com/eldemonstro/dawnbot")
      .then(message => console.log(`Sent message: ${message.content}`))
      .catch(console.error);
  }
}];

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

// When the bot see a message execute this
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
