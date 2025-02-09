import { Table, Column, Model, DataType, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Car } from 'src/cars/entities/Car';

@Table({ tableName: 'orders' })
export class Order extends Model<Order> {

    @ForeignKey(() => Car)
    @Column({ type: DataType.INTEGER, allowNull: false })
    carId: number;

    @Column({ type: DataType.DATE, allowNull: false })
    startDate: Date;

    @Column({ type: DataType.DATE, allowNull: false })
    endDate: Date;

    @Column({ type: DataType.FLOAT, allowNull: false })
    totalPrice: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    quantity: number;

    @BelongsTo(() => Car)
    car: Car;
}