const { Permissions } = require("discord.js");
const database = require("../Models/database");

module.exports = {
  name: "kanal-log",
  description: "Kanal log sistemini açmak veya kapatmak için kullanılır.",
  guildOnly: true,
  async execute(message, args, bot) {
    var guildData = await database.findOne({ guildID: message.guild.id });

    if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR))
      return message.reply({
        content: `Bu komutu kullanmak için iznin yeterli değil.`,
      });


    if (args[0] === "aç") {
      if (guildData && guildData.channelLog == true)
        return message.reply({
          content: `Hey! zaten **${this.name}** aktif.`,
        });
      message.reply({
        content: `Başarıyla **${this.name}** adlı log sistemi **aktif edildi**.`,
      });

      await database.findOneAndUpdate(
        { guildID: message.guild.id },
        { channelLog: true },
        { upsert: true }
      );
    } else {

    if (args[0] === "kapat") {
      if (guildData && guildData.channelLog == false)
        return message.reply({
          content: `Hey! zaten **${this.name}** devre dışı.`,
        });

      message.reply({
        content: `Başarıyla **${this.name}** adlı log sistemi **devre dışı bırakıldı**.`,
      });

      await database.findOneAndUpdate(
        { guildID: message.guild.id },
        { channelLog: false },
        { upsert: true }
      );
    } else {

    var channel =
      message.mentions.channels.first() ||
      message.guild.channels.cache.get(args[1]);

    if (args[0] === "log-ayarla") {
      if (!channel)
        return message.reply({
          content: `Ayarlamak için kanal etiketle veya ID'sini yazmalısın.`,
        });

      await database
        .findOneAndUpdate(
          { guildID: message.guild.id },
          { $set: { channelChannelID: channel.id } },
          { upsert: true }
        )
        .then(() => {
          message.reply({
            content: `Başarılı **${this.name}** kanalını ayarlandın.`,
          });
        });
    } else {
 
    if (args[0] === "log-sıfırla") {
      if (guildData && guildData.channelChannelID) {
        await database
          .findOneAndUpdate(
            { guildID: message.guild.id },
            { $unset: { channelChannelID: "" } },
            { upsert: true }
          )
          .then(() => {
            message.reply({
              content: `Başarılı **${this.name}** kanalını sıfırladın.`,
            });
          });
      } else {
        message.reply({
          content: `Log kanalı zaten ayarlı değil sıfırlayamazsın.`,
        });
      }
    } else {
      return message.reply({
        content: `Geçersiz argüman (aç, kapat, log-ayarla, log-sıfırla) yazabilirsin.`,
      });
    }}}}
  },
};
