import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { VendorService } from './vendor.service';

@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) { }


  @Get(':vendorid/stock')
  syncvendor(@Param('vendorid') vendorid: string) {
    return this.vendorService.syncvendor(vendorid);
  }

}
