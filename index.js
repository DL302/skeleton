const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const command = require('./command');
client.on('ready', () => {
    console.log('start.');

    command(client, 'ping', (message) => {
        message.channel.send('Pong.');
    });

    command(client, ['shrugflip', 'sf'], (message) => {
        message.channel.send('┻━┻︵ ¯\\_(ツ)_/¯ ︵ ┻━┻');
    });
});

client.login(config.token);