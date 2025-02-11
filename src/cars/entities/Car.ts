import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Order } from 'src/orders/entities/Order';

@Table({ tableName: 'cars' })
export class Car extends Model<Car> {

    @Column({ type: DataType.STRING, allowNull: false })
    brand: string;

    @Column({ type: DataType.STRING, allowNull: false })
    model: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    year: number;

    @Column({ type: DataType.STRING, allowNull: false })
    color: string;

    @Column({ type: DataType.FLOAT, allowNull: false })
    pricePerHour: number;

    @Column({ type: DataType.INTEGER, allowNull: false, defaultValue: 1 })
    availableQuantity: number;

    @HasMany(() => Order)
    orders: Order[];
}