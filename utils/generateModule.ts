export const generateModule = (name: string) => {
  return `
import { Module } from '@nestjs/common';
import { ${name}Controller } from './${name.toLowerCase()}.controller';
import { ${name}Service } from './${name.toLowerCase()}.service';

@Module({
  imports: [],
  controllers: [${name}Controller],
  providers: [${name}Service],
})
export class ${name}Module {}

`;
};
