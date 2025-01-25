export const generateController = (name: string) => {
  return `
import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Roles } from '@prisma/client';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { LocaleHeader } from 'src/_modules/authentication/decorators/locale.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { PrismaService } from 'src/globals/services/prisma.service';
import { ResponseService } from 'src/globals/services/response.service';
import { CurrentUser } from '../../../authentication/decorators/current-user.decorator';
import {
  Create${name}DTO,
  Filter${name}DTO,
  Update${name}DTO,
} from './dto/${name.toLowerCase()}.dto';
import { ${name}Service } from './services/${name.toLowerCase()}.service';

const prefix = '${name}';

@Controller(prefix.toLowerCase())
@ApiTags(prefix)
export class ${name}Controller {
  constructor(
    private readonly prisma: PrismaService,
    private readonly service: ${name}Service,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({})
  async create(
    @Res() res: Response,
    @Body() body: Create${name}DTO
  ) {
    await this.prisma.validateBody(body);
    await this.service.create(body);
    return this.response.created(res, '${name.toLowerCase()}_created_successfully');
  }

  @Patch('/:id')
  @Auth({
  })
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Body() body: Update${name}DTO,
    @Param() { id }: RequiredIdParam,
  ) {
    await this.prisma.returnUnique('${name.toLowerCase()}', 'id', id);
    await this.service.update(id, body);
    return this.response.created(res, '${name.toLowerCase()}_updated_successfully');
  }
  @Get(['/', '/:id'])
  @Auth({
  })
  @ApiQuery({ type: PartialType(Filter${name}DTO) })
  async findAll(
    @Res() res: Response,
    @LocaleHeader() locale: Locale,
    @Filter({ dto: Filter${name}DTO }) filters: Filter${name}DTO,
  ) {

  if(filters.id) await this.prisma.returnUnique('${name.toLowerCase()}', 'id', id);

    const { data, total } = await this.service.findAll(locale, filters);

    return this.response.success(
      res,
      '${name.toLowerCase()}_fetched_successfully',
      data,
      { total },
    );
  }
}

  @Delete('/:id')
  @Auth({ permissions: [prefix] })
  @ApiRequiredIdParam()
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.prisma.returnUnique('${name.toLowerCase()}', 'id', id);
    await this.service.delete(id);
    return this.response.success(
      res,
      'delete_${name.toLowerCase()}_successfully',
    );
  }

`;
};
