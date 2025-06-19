import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { VendorRepo } from './vendor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { VendorProduct } from 'src/entities/vendorproduct.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, VendorProduct])],

  controllers: [VendorController],
  providers: [VendorService, VendorRepo],
})
export class VendorModule { }
