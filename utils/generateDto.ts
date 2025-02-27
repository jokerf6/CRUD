import { Field } from "../types/field.type";

const mapDtoType = (type: never) => {
  const dtoTypeMap = {
    Int: "number",
    String: "string",
    Image: "string",
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
  import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
  import { ValidateOrder } from 'src/decorators/dto/validators/validate-order.decorator';

  export class Create${name.at(0)?.toUpperCase() + name.slice(1)}DTO {
    ${fields
      .map((f: Field) => {
        console.log(f);
        const decorators = [];
        const type = f.isRelation ? "Int" : mapDtoType(f.type as never);

        if (f.required) decorators.push(`@Required()`);
        else decorators.push(`@Optional()`);

        if (f.type === "Image")
          decorators.push(
            `@ApiProperty({ type: String, format: 'binary',required: ${
              f.required ? true : false
            } })`
          );
        if (f.type === "DateTime") decorators.push(`@ValidateDate()`);
        if (f.type === "Int") decorators.push(`@ValidateNumber()`);
        if (f.type === "Boolean") decorators.push(`@ValidateBoolean()`);

        return `
    ${decorators.join("\n")}
    ${f.isRelation ? f.name.toLowerCase() + "Id" : f.name}${
          f.required ? "" : "?"
        }: ${type};`;
      })
      .join("\n")}
  }
  export class Update${
    name.at(0)?.toUpperCase() + name.slice(1)
  }DTO extends PartialType(Create${
    name.at(0)?.toUpperCase() + name.slice(1)
  }DTO) {}    
  
  export class Sort${name.at(0)?.toUpperCase() + name.slice(1)}DTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
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
    export class Filter${
      name.at(0)?.toUpperCase() + name.slice(1)
    }DTO extends PaginationParamsDTO {
        
  @ValidateNumber()
    id?: Id;

     ${fields
       .map((f: Field) => {
         console.log(f);
         const decorators = [];
         const type = f.isRelation ? "Int" : mapDtoType(f.type as never);

         if (f.required) decorators.push(`@Required()`);
         else decorators.push(`@Optional()`);

         if (f.type === "Image")
           decorators.push(
             `@ApiProperty({ type: String, format: 'binary',required: ${
               f.required ? true : false
             } })`
           );
         if (f.type === "DateTime") decorators.push(`@ValidateDate()`);
         if (f.type === "Int") decorators.push(`@ValidateNumber()`);
         if (f.type === "Boolean") decorators.push(`@ValidateBoolean()`);

         return `
    @Optional()
    ${f.isRelation ? f.name.toLowerCase() + "Id" : f.name}?: ${type};`;
       })
       .join("\n")}

      @ValidateOrder() 
      orderBy?: Sort${name}DTO[];
  }
  `;
};
