const axios = require("axios");

module.exports = async (client, member) => {
  if (member.guild.id === "733620693392162866") {
    const rawData = await axios({
      method: "get",
      url: `https://registry.rover.link/api/guilds/733620693392162866/discord-to-roblox/${member.id}`,
      headers: {
        Authorization:
          "Bearer rvr2g05knitxx4pbua2xbj3iy0ok4rbv9tiye1rd480k8h1f7wgfdiu4myutljxny7h9",
      },
    });

    if (rawData.data.cachedUsername === null) {
      return;
    }
    member.setNickname(rawData.data.cachedUsername).catch(() => {
      const channel = client.channels.fetch("1231268231075987568");
      channel.send(
        `${member}'s nickname could not be set. Please change it to > \`${rawData.data.cachedUsername}\``
      );
    });
  } else {
    return;
  }
};
