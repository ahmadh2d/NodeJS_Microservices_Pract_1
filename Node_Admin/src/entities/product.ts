import { Column, Entity, ObjectIdColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
    @PrimaryGeneratedColumn()
    @ObjectIdColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    image: string;

    @Column({default: 0})
    like: number;
}
