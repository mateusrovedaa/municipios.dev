import { DataTypes, Model } from 'sequelize';
import db from '../db';

export class City extends Model {
    declare slug: string;
    declare name: string;
    declare province: string;
    declare ibgecode: number;
    declare mayor: string;
    declare gentle: string;
    declare idhm: number;
    declare population: bigint;
    declare updatedAt: Date;

    static locateCity = async (city: string, province: string) => {
        return await this.findOne({
            where: {
                slug: city,
                province: province
            }
        });
    }
}

City.init({
    slug: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    province: {
        type: DataTypes.CHAR(2),
        allowNull: false,
        primaryKey: true
    },
    ibgecode: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    mayor: {
        type: DataTypes.STRING,
        allowNull: false
    },
    gentle: {
        type: DataTypes.STRING,
        allowNull: false
    },
    idhm: {
        type: DataTypes.DOUBLE,
        allowNull: false
    },
    population: {
        type: DataTypes.BIGINT,
        allowNull: false
    },
    site: {
        type: DataTypes.STRING,
        allowNull: true
    }
}, {
    sequelize: db,
    tableName: 'cities',
    modelName: 'City',
    timestamps: true,
    createdAt: false
});