import { IsInt, IsNumber, IsString, Min } from 'class-validator'

export class CreateOrderDto {
  @IsNumber()
  productId: number

  @IsInt()
  @Min(1)
  quantity: number
}
