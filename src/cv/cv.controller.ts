import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    return this.cvService.create(createCvDto, this.getAuthenticatedUserId(req));
  }

  @Get()
  findAll() {
    return this.cvService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cvService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
    @Req() req: Request,
  ) {
    return this.cvService.update(
      id,
      updateCvDto,
      this.getAuthenticatedUserId(req),
    );
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.cvService.remove(id, this.getAuthenticatedUserId(req));
  }

  private getAuthenticatedUserId(req: Request): number {
    if (req.userId === undefined) {
      throw new UnauthorizedException('Missing authenticated user');
    }

    return req.userId;
  }
}
