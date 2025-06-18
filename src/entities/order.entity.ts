import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm'

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  productId: number

  @Column()
  quantity: number

  @Column()
  status: 'PENDING' | 'SUCCESS' | 'FAILED'

  @CreateDateColumn()
  createdAt: Date
}
