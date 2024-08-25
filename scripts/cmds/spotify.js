 const axios = require('axios');

module.exports = {
  config: { 
    name: "spotify", 
    countDown: 5, 
role: 0,
    author: "", 
    category: "media"
  },
  onStart: async ({ message, args }) => {
    if (!args[0]) return message.reply("please add a title");
message.reply(`Downloading... "${args.join(" ")}" please wait..`);
    try {
      const { metadata: {title, releaseDate }, link } = await spotify(args[0]);
      message.reply({
        body: `Title: ${title}\nRelease: ${releaseDate}`,
        attachment: await global.utils.getStreamFromURL(link, "spotify.mp3"),
      });
    } catch (e) {
      throw e;
    }
  }
};

const spotify = async (q) => {
  try {
    const url = `https://apiv3-2l3o.onrender.com`;
    const trackUrl = (await axios.get(`${url}/spotifs?q=${encodeURIComponent(q)}`)).data[0]?.track_url;
    if (!trackUrl) throw new Error(`${q} not found`);
    return (await axios.get(`${url}/spotifydl?link=${trackUrl}`)).data;
  } catch (e) {
    return e.response?.data || e.message;
  }
};