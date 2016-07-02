'use strict';

const Action = require('./Action');
const Constants = require('../../util/Constants');
const Message = require('../../structures/Message');

class GuildMemberRemoveAction extends Action {

	constructor(client) {
		super(client);
		this.timeouts = [];
		this.deleted = {};
	}

	handle(data) {
		let client = this.client;
		let guild = client.store.get('guilds', data.guild_id);
		if (guild) {
			let member = guild.store.get('members', data.user.id);
			if (member) {
				guild._removeMember(member);
				this.deleted[guild.id + data.user.id] = member;
				this.scheduleForDeletion(guild.id, data.user.id);
			}

			if (!member) {
				member = this.deleted[guild.id + data.user.id];
			}

			return {
				g: guild,
				m: member,
			};
		}

		return {
			g: guild,
			m: null,
		};
	}

	scheduleForDeletion(guildID, userID) {
		this.timeouts.push(
			setTimeout(() => delete this.deleted[guildID + userID],
			this.client.options.rest_ws_bridge_timeout)
		);
	}
};

module.exports = GuildMemberRemoveAction;