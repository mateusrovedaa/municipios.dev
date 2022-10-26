import { DataTypes, Model } from 'sequelize';
import db from '../db';

export class City extends Model { }

City.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }
}, {
    sequelize: db,
    tableName: 'cities',
    modelName: 'City'
});