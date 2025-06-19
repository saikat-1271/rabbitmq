import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from 'src/entities/product.entity';
import { VendorProduct } from 'src/entities/vendorproduct.entity';
import { Repository } from 'typeorm';


@Injectable()
export class VendorRepo {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,

    @InjectRepository(VendorProduct)
    private readonly vendorProductRepo: Repository<VendorProduct>,
  ) { }


  async allproduct() {
    try {
      return this.productRepo.createQueryBuilder().select().getMany();

    } catch (e) {
      throw e
    }
  }

  async allvendorproduct() {
    try {
      return this.vendorProductRepo.createQueryBuilder().select().getMany();

    } catch (e) {
      throw e
    }
  }

  async findvendor(vendorid) {
    try {

      const res = await this.vendorProductRepo.createQueryBuilder('vp')
        .select()
        .where('vp.vendorId = :vendorid', { vendorid: vendorid })
        .getMany()

      return res && res.length > 0 ? res : []

    } catch (e) {
      throw e
    }
  }
  async updatelocalproduct(vendordata: VendorProduct[]) {
    try {

      await this.productRepo.save(
        vendordata.map((item) => ({
          id: item.id,
          vendorId: item.vendorId,
          name: item.name,
          stock: item.stock,
        }))
      );

    } catch (e) {
      throw e
    }
  }
  async allvendors() {
    try {

      const res = await this.vendorProductRepo.createQueryBuilder('v').select('DISTINCT (v.vendorId)').getRawMany();
      const vendorlist = res && res.length > 0 ? res.map((v) => v.vendorId) : [];
      return vendorlist;


    } catch (e) {
      throw e
    }
  }


}
