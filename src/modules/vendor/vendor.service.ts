import { Injectable } from '@nestjs/common';
import { VendorRepo } from './vendor.repository';
import { VendorProduct } from 'src/entities/vendorproduct.entity';
import { Cron } from '@nestjs/schedule';


@Injectable()
export class VendorService {
  constructor(private readonly Vendorrepo: VendorRepo) { }


  async syncvendor(vendorid: string) {
    try {
      // fetching updated vendor data
      const vendordata: VendorProduct[] = await this.Vendorrepo.findvendor(vendorid);
      if (vendordata.length > 0) {
        console.log('Updated data received -->', JSON.stringify(vendordata))
        // upserting new and existing data stock
        await this.Vendorrepo.updatelocalproduct(vendordata)
      }

      return 'success';
    } catch (e) {
      throw e
    }
  }


  @Cron('0,30 * * * *')
  async autoSyncVendors() {
    const vendors = await this.Vendorrepo.allvendors();
    for (const vendor of vendors) {
      await this.syncvendor(vendor);
      console.log(`[Auto Sync] Synced vendor: ${vendor}`);
    }
  }

  async allproduct() {
    try {
      return this.Vendorrepo.allproduct();

    } catch (e) {
      throw e
    }
  }
  async allvendorproduct() {
    try {
      return this.Vendorrepo.allvendorproduct();

    } catch (e) {
      throw e
    }
  }


}
