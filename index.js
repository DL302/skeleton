const Discord = require('discord.js');
const client = new Discord.Client();

const config = require('./config.json');
const command = require('./command');
client.on('ready', () => {
    console.log('start.');

    command(client, 'ping', message => {
        message.channel.send('Pong.');
    });

    command(client, 'a2a', message => {
        message.channel.send('https://raw.githubusercontent.com/DL302/skeleton/master/assets/a2a.png');
    });

    command(client, 'eval', message => {
        const { member, channel, content } = message;
        if (member.id === config.ownerID && content.search(/config/gi) === -1) {
            const result = eval(content.replace(`${config.prefix}eval `, ''));
            channel.send(result);
            console.log(result);
        }
    });
    // prevent blacklisted members from joining vc, this is set in the config file
    client.on('voiceStateUpdate', newState => {
        if (config.preventBlacklistVC) {
            config.blacklist.forEach(id => {
                if (newState.id === id) {
                    newState.kick();
                }
            });
        }
    });
    /*
    // regular shrugflip command
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
                    required: false
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
            const name = args.find(arg => arg.name.toLowerCase() === 'content').value.toLowerCase();
            let numbertext = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
            let emoji_name = ':arrow_left: ';
            if (name === '') {
                emoji_name = '';
            }
            for (char of name) {
                if (char === ' ') {
                    emoji_name += '     ';
                }
                else if (char === '.') {
                    emoji_name += ':record_button:';
                }
                else if (char === '!') {
                    emoji_name += ':exclamation:';
                }
                else if (char === '?') {
                    emoji_name += ':question:';
                }
                else if (!isNaN(char)) {
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
                        content: `:man_cartwheeling: ${emoji_name}\n\n\n\n                        :manual_wheelchair: :person_golfing:`
                    }
                }
            });
        }
    });
});

client.login(config.token);
