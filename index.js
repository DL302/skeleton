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

    command(client, '8ball', message => {
        let response = '';
        switch (Math.floor(Math.random() * 20)) {
            case 0:
                response = 'It is certain.';
                break;
            case 1:
                response = 'It is decidedly so.';
                break;
            case 2:
                response = 'Without a doubt.';
                break;
            case 3:
                response = 'Yes - definitely.';
                break;
            case 4:
                response = 'You may rely on it.';
                break;
            case 5:
                response = 'As I see it, yes.';
                break;
            case 6:
                response = 'Most likely.';
                break;
            case 7:
                response = 'Outlook good.';
                break;
            case 8:
                response = 'Yes.';
                break;
            case 9:
                response = 'Signs point to yes.';
                break;
            case 10:
                response = 'Reply hazy, try again.';
                break;
            case 11:
                response = 'Ask again later.';
                break;
            case 12:
                response = 'Better not tell you now.';
                break;
            case 13:
                response = 'Cannot predict now.';
                break;
            case 14:
                response = 'Concentrate and ask again.';
                break;
            case 15:
                response = 'Don\'t count on it.';
                break;
            case 16:
                response = 'My reply is no.';
                break;
            case 17:
                response = 'My sources say no.';
                break;
            case 18:
                response = 'Outlook not so good.';
                break;
            case 19:
                response = 'Very doubtful.';
                break;
        }
        message.channel.send(response);
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
