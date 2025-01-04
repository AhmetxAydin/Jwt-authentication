import {
    Table,
    Model,
    Column,
    DataType,
    PrimaryKey,
    CreatedAt,
    UpdatedAt,
    BeforeCreate,
    BeforeUpdate,
    BeforeSave,
} from 'sequelize-typescript';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'users' , schema: 'dbo'})
export class User extends Model {

    @PrimaryKey
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    })
    id: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    first_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    last_name: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({ allowNull: true })
    refresh_token: string;

    @CreatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    create_At: Date;

    @UpdatedAt
    @Column({
        type: DataType.DATE,
        allowNull: true,
    })
    update_At: Date;

    @BeforeCreate
    static setCreatedAt(user: User) {
        user.create_At = new Date();
    }

    @BeforeUpdate
    static setUpdatedAt(user: User) {
        user.update_At = new Date();
    }

    @BeforeSave
    static async hashPassword(user: User) {
        if (user.password && user.changed('password')) {
            user.password = await bcrypt.hash(user.password, 10);
        }
    }
}
