module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                notEmpty: true
            },
            primaryKey: true
        },

        email: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        first_name: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        last_name: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    User.associate = models => {
        User.hasMany(models.Publication, {
            foreignKey: 'student_id',
            as: 'publications'
        })
    }
    return User;
}