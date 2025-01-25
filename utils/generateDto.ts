import { Field } from "../types/field.type";

const mapDtoType = (type: never) => {
  const dtoTypeMap = {
    Int: "number",
    String: "string",
    Boolean: "boolean",
    DateTime: "Date",
  };
  return dtoTypeMap[type] || type;
};
export const generateDTO = (name: string, fields: Field[]) => {
  return `
  import { ApiProperty } from '@nestjs/swagger';
  import { Optional } from 'src/decorators/dto/optional-input.decorator';
  import { Required } from 'src/decorators/dto/required-input.decorator';
  import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
  import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
  import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';
  import { PartialType } from '@nestjs/swagger';
  import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
  
  export class Create${name}DTO {
    ${fields
      .map((f: Field) => {
        const decorators = [];
        const type = f.isRelation ? "Int" : mapDtoType(f.type as never);

        if (f.required) decorators.push(`@Required()`);
        else decorators.push(`@Optional()`);

        if (f.type === "Image")
          decorators.push(
            `@ApiProperty({ type: String, format: 'binary',required: ${f.required} })`
          );
        if (f.type === "DateTime") decorators.push(`@ValidateDate()`);
        if (f.type === "Int") decorators.push(`@ValidateNumber()`);
        if (f.type === "Boolean") decorators.push(`@ValidateBoolean()`);

        return `
    ${decorators}
    ${f.isRelation ? f.name.toLowerCase() + "Id" : f.name}${
          f.required ? "" : "?"
        }: ${type};`;
      })
      .join("\n\n")}
  }
  export class Update${name}DTO extends PartialType(Create${name}DTO) {}    
  
  export class Sort${name}DTO {
    @SortProp()
    id?: SortOptions;
  
  ${fields
    .map((f) => {
      if (f.sortAble === true) {
        return `
          @SortProp()
    ${f.isRelation ? f.name.toLowerCase() + "Id" : f.name}?: SortOptions;`;
      }
    })
    .join("\n\n")}
    
  }
    export class Filter${name}DTO extends PaginationParamsDTO {
  ${fields
    .map((f) => {
      if (f.sortAble === true) {
        return `
          @SortProp()
    ${f.isRelation ? f.name.toLowerCase() + "Id" : f.name}?: SortOptions;`;
      }
    })
    .join("\n\n")}
    
  }
  `;
};
