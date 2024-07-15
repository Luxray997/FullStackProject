module.exports = (sequelize, DataTypes) => {
    const Publication = sequelize.define("Publication", {
        id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                notEmpty: true
            },
            primaryKey: true,
            autoIncrement: true
        },

        student_id: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        title: {
            type: DataTypes.STRING, 
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },

        year: {
            type: DataTypes.INTEGER, 
            allowNull: false,
            validate: {
                notEmpty: true
            }
        }
    });

    Publication.associate = models => {
        Publication.belongsTo(models.User, {
            foreignKey: 'student_id',
            as: 'student'
        });
    };

    return Publication;
}