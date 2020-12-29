const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const command = require('./command');
client.on('ready', () => {
    console.log('start.');

    command(client, 'ping', message => {
        message.channel.send('Pong.');
    });

    command(client, 'eval', message => {
        const { member, channel, content } = message;
        if (member.id === config.ownerID && content.search(/config/gi) === -1) {
            const result = eval(content.replace(`${config.prefix}eval `, ''));
            channel.send(result);
            console.log(result);
        }
    });

    /*
    //regular shrugflip command
    command(client, ['shrugflip', 'sf'], message => {
        message.channel.send('┻━┻︵ ¯\\_(ツ)_/¯ ︵ ┻━┻');
    });
    */

    // sf/shrugflip command using new slash command feature
    // client.api.applications(client.user.id).guilds('765292898715303936').commands.post({
    client.api.applications(client.user.id).commands.post({
        data: {
            name: 'shrugflip',
            description: 'shrug + tableflip'
            // possible options here e.g. options: [{...}]
        }
    });


    client.ws.on('INTERACTION_CREATE', async interaction => {
        const command = interaction.data.name.toLowerCase();
        const args = interaction.data.options;

        if (command === 'shrugflip') {
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: '┻━┻︵ ¯\\_(ツ)_/¯ ︵ ┻━┻'
                    }
                }
            });
        }
    });
});

client.login(config.token);