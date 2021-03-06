const Action = require('./Action');

class GuildSync extends Action {
  handle(data) {
    const client = this.client;

    const guild = client.guilds.get(data.id);
    if (guild) {
      data.presences = data.presences || [];
      for (const presence of data.presences) {
        const user = client.users.get(presence.user.id);
        if (user) {
          user.status = presence.status;
          user.game = presence.game;
        }
      }

      data.members = data.members || [];
      for (const syncMember of data.members) {
        const member = guild.members.get(syncMember.user.id);
        if (member) {
          guild._updateMember(member, syncMember);
        } else {
          guild._addMember(syncMember);
        }
      }
    }
  }
}

module.exports = GuildSync;
