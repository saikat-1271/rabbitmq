import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }


  @Get(':vendorid/stock')
  syncvendor(@Param('vendorid') vendorid: string) {
    return this.vendorService.syncvendor(vendorid);
  }
  @Get('vendorsync')
  syncvendoror() {
    return this.vendorService.autoSyncVendors();
  }
  @Get('allproduct')
  async allproduct() {
    try {
      return this.vendorService.allproduct();

    } catch (e) {
      throw e
    }
  }
  @Get('allvendorproduct')
  async allvendorproduct() {
    try {
      return this.vendorService.allvendorproduct();

    } catch (e) {
      throw e
    }
  }


}
