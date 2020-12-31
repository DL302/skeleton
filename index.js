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
    client.api.applications(client.user.id).commands.post({
        data: {
            name: 'sendoutofwheelchair',
            description: 'a text image depicting someone being hit out of a wheelchair by a man golfing',
            options: [
                {
                    name: 'content',
                    description: 'name of person to be sent out of wheelchair',
                    type: 3,
                    required: true
                }
            ]
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
        if (command === 'sendoutofwheelchair') {
            const name = args.find(arg => arg.name.toLowerCase() === 'content').value;
            let numbertext = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            let emoji_name = '';
            for (char of name) {
                if (!isNaN(char)) {
                    emoji_name += `:${numbertext[+char]}: `
                }
                else if ((/[a-z]/).test(char)) {
                    emoji_name += `:regional_indicator_${char}: `;
                }
                else {
                    continue;
                }
            }
            client.api.interactions(interaction.id, interaction.token).callback.post({
                data: {
                    type: 4,
                    data: {
                        content: `:man_cartwheeling: :arrow_left: ${emoji_name}\n\n\n\n                        :manual_wheelchair: :person_golfing:`
                    }
                }
            });
        }
    });
});

client.login(config.token);