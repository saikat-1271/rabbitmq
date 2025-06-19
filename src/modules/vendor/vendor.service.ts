import { Injectable } from '@nestjs/common';
import { VendorRepo } from './vendor.repository';
import { VendorProduct } from 'src/entities/vendorproduct.entity';


@Injectable()
export class VendorService {
  constructor(private readonly Vendorrepo: VendorRepo) { }


  async syncvendor(vendorid: string) {
    try {
      const vendordata: VendorProduct[] = await this.Vendorrepo.findvendor(vendorid);
      if (vendordata.length > 0) {
        console.log('Updated data received -->', JSON.stringify(vendordata))
        await this.Vendorrepo.updatelocalproduct(vendordata)
      }

      return 'success';
    } catch (e) {
      throw e
    }
  }


}
