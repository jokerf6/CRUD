import { Field } from "../types/field.type";

export const generatePrismaArgs = (name: string, fields: Field[]) => {
  return `
import { Prisma, Withdraw } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { filterKey, orderKey } from 'src/globals/helpers/prisma-filters';
import { Filter${name.toLowerCase()}DTO } from '../dto/${name.toLowerCase()}.dto';

export const get${name.toLowerCase()}Args = (query: Filter${name.toLowerCase()}DTO) => {
  const { page, limit, ...filter } = query;
  const searchArray = [
   ${fields
     .map((f: Field, idx: number) => {
       if (f.filterAble) {
         return `
    filterKey<${name}>(filter, '${f.name.toLowerCase()}')${
           idx + 1 < fields.length ? "," : ""
         }   
     `;
       }
     })
     .join("\n\n")}
  ].filter(Boolean) as Prisma.${name}WhereInput[];

  const orderArray = [
    
${fields
  .map((f: Field, idx: number) => {
    if (f.sortAble) {
      return `
         orderKey('${f.name.toLowerCase()}', '${f.name.toLowerCase()}', orderBy)${
        idx + 1 < fields.length ? "," : ""
      }
     `;
    }
  })
  .join("\n\n")}
    ].filter(Boolean) as Prisma.${name}OrderByWithRelationInput[];


  return {
    ...paginateOrNot({ limit, page }, query?.id),
        orderBy: orderArray,
    where: {
      AND: searchArray,
    },
  } as Prisma.${name}FindManyArgs;
};

export const select${name}OBJ = () => {
  const selectArgs: Prisma.${name}Select = {
    id: true,
    ${fields
      .map((f: Field) => {
        if (!f.isRelation) {
          return `
    ${name}:true   
     `;
        }
      })
      .join("\n\n")}
  };
  return selectArgs;
};
export const get${name}ArgsWithSelect = () => {
  return {
    select: select${name}OBJ(),
  } satisfies Prisma.${name}FindManyArgs;
};

    
  
  `;
};
