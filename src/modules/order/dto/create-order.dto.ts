import { IsInt, IsString, Min } from 'class-validator'

export class CreateOrderDto {
  @IsString()
  productId: string

  @IsInt()
  @Min(1)
  quantity: number
}
