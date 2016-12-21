var Sequelize = require('sequelize');
var bcrypt = require("bcrypt-nodejs");

module.exports = function(sequelize, DataTypes) {
    var User = sequelize.define(
        'User',
        {
            id: {
                type: Sequelize.INTEGER,
                autoIncrement: true,
                unique: true,
                primaryKey: true
            },
            username: {
                type: DataTypes.STRING,
                unique: true,
                validate: {
                    notEmpty: {msg: "-> Falta username"}
                }
            },
            password: {
                type: DataTypes.STRING,
                validate: { notEmpty: {msg: "-> Falta password"}},
                set: function (password) {
                    var hash = bcrypt.hashSync(password);
                    this.setDataValue('password', hash);
                }
            },
            displayName: {
                type: DataTypes.STRING
            }
        }
    );

    return User;
}
