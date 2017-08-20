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


const config = require('./config');
const Discord = require("discord.js");
const chalk = require('chalk');
const client = new Discord.Client();

const commands = ['echo', 'github'];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  console.time("command");
  let command = msg.content.split(/\s+/g) || [];
  if (client.user.id === msg.author.id) {
    return;
  }
  console.log(command, chalk.blue(client.user.id));
  console.log(chalk.green(msg.author.id));

  if (command[0] === "!db") {
    if (commands.find((element, index, array) => {
        return element == command[1];
      })) {
      switch (command[1]) {
        case 'echo':
          if (command[2])
            msg.channel.send(command[2])
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
          return
          break;
        case 'github':
          msg.channel.send('https://github.com/eldemonstro/dawnbot/')
            .then(message => console.log(`Sent message: ${message.content}`))
            .catch(console.error);
          return
          break;
        default:
          return;
      }
    }
  }
  console.timeEnd("command");
});

client.login(config.token);
