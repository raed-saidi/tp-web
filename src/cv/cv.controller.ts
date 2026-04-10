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
import { AuthRequest } from 'src/auth/auth.request';
import { CvService } from './cv.service';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { JwtAuthGuard } from '../auth/guards/authGuard';
import { JwtPayload } from 'src/jwt-payload.interface';

@Controller('cv')
export class CvController {
  constructor(private readonly cvService: CvService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createCvDto: CreateCvDto, @Req() req: AuthRequest) {
    return this.cvService.create(createCvDto, this.getAuthenticatedUser(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.cvService.findAll(this.getAuthenticatedUser(req));
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    return this.cvService.findOne(id, this.getAuthenticatedUser(req));
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCvDto: UpdateCvDto,
    @Req() req: AuthRequest,
  ) {
    return this.cvService.update(
      id,
      updateCvDto,
      this.getAuthenticatedUser(req),
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: AuthRequest) {
    return this.cvService.remove(id, this.getAuthenticatedUser(req));
  }

  private getAuthenticatedUser(req: AuthRequest): { userId: number; role: string } {
    const payload = req.user as JwtPayload;

    if (!payload || typeof payload.userId !== 'number' || !payload.role) {
      throw new UnauthorizedException('Invalid or missing token payload');
    }

    return {
      userId: payload.userId,
      role: payload.role,
    };
  }
}
