import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class VendorProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  vendorId: string;

  @Column()
  name: string;

  @Column()
  stock: number;
}
