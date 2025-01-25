export const generateService = (name: string) => {
  return `
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { localizedObject } from 'src/globals/helpers/localized.return';
import {
  Create${name}DTO,
  Filter${name}DTO,
  Update${name}DTO,
} from '../dto/${name.toLowerCase()}.dto';
import {
  get${name}Args,
  get${name}ArgsWithSelect,
} from '../prisma-args/${name}.prisma.args';

@Injectable()
export class ${name}Service {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async create(body: Create${name}DTO) {

      await this.prisma.${name.toLowerCase()}.create({
        data: {
          ...body
        },
      });

  }

  async update(id: Id, body: Update${name}DTO) {
   
    await this.prisma.${name.toLowerCase()}.update({ where: { id }, data: body });
   
  }

  async findAll(locale: Locale, filters: Filter${name}DTO) {
    const args = get${name}Args(filters);
    const argsWithSelect = get${name}ArgsWithSelect();

    const data = await this.prisma.${name.toLowerCase()}[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    const total = await this.prisma.${name.toLowerCase()}.count({ where: args.where });
    return { data: localizedObject(data, locale), total };
  }


    async delete(id: Id): Promise<void> {
    await this.prisma.${name.toLowerCase()}.delete({
      where: {
        id,
      },
    });
  }

}
`;
};
