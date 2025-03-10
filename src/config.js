require("dotenv").config();

module.exports = {
    token: process.env.TOKEN,
    roleId: process.env.ROLE_ID,
    logChannelId: process.env.LOG_CHANNEL_ID,
    usuarioId: process.env.USUARIO_ID,
    registrarId: process.env.REGISTRAR_ID,
    registreseId: process.env.REGISTRESE_ID,
    staffLogChannelId: process.env.STAFF_LOG_CHANNEL,
    usersCountId: process.env.USERS_COUNT_ID
};