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
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/authGuard';
import { JwtPayload } from 'src/jwt-payload.interface';
@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: Request) {
    return this.cvService.create(createCvDto, this.getAuthenticatedUser(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: Request) {
    return this.cvService.findAll(this.getAuthenticatedUser(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.cvService.findOne(id, this.getAuthenticatedUser(req));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
    @Req() req: Request,
  ) {
    return this.cvService.update(
      id,
      updateCvDto,
      this.getAuthenticatedUser(req),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    return this.cvService.remove(id, this.getAuthenticatedUser(req));
  }

  private getAuthenticatedUser(req: Request): { id: number; role: string } {
    const payload = req.user as JwtPayload;
    if (!payload || typeof payload.userId !== 'number' || !payload.role) {
      throw new UnauthorizedException('Invalid or missing token payload');
    }

    return { id: payload.userId, role: payload.role };
  }
}
