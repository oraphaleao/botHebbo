// src/utils/database.js
const { Sequelize, DataTypes } = require("sequelize");
const config = require("../config");

// Conexão com o banco de dados
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false,
});

// Modelo da tabela de usuários
const User = sequelize.define("users", {
    motto: {
        type: DataTypes.STRING,
        allowNull: true,  // O campo 'motto' pode ser nulo, pois nem todos os usuários podem ter um valor
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    invite_discord: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    timestamps: false
});

// Sincroniza o banco (Cria a tabela se não existir)
sequelize.sync();

// Função para verificar o motto (token) do usuário
async function verifyMotto(motto) {
    // Procurando no banco de dados pela coluna 'motto'
    const user = await User.findOne({ where: { motto } });
    return user ? user : null; // Retorna os dados do usuário, caso encontrado
}

// 📊 Buscar contagem de convites do usuário que convidou
async function getInviterData(inviterId) {
    return await User.findOne({ where: { id: inviterId } });
}

// 📌 Criar um novo registro se o usuário ainda não existir
async function createInviterData(inviterId) {
    return await User.create({ id: inviterId, invite_discord: 1 });
}

// 📈 Atualizar o número de convites do usuário
async function updateInviterData(inviterId) {
    const user = await User.findOne({ where: { id: inviterId } });
    if (user) {
        await user.increment("invite_discord");
    } else {
        await User.create({ id: inviterId, invite_discord: 1 });
    }
}

module.exports = { verifyMotto, getInviterData, createInviterData, updateInviterData };
