import { Field } from "../types/field.type";

export const generatePrismaArgs = (name: string, fields: Field[]) => {
  return `
import { Prisma, ${name} } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import { filterKey, orderKey } from 'src/globals/helpers/prisma-filters';
import { Filter${name}DTO } from '../dto/${name.toLowerCase()}.dto';

export const get${
    name.at(0)?.toUpperCase() + name.slice(1)
  }Args = (query: Filter${name.at(0)?.toUpperCase() + name.slice(1)}DTO) => {
  const {orderBy, page, limit, ...filter } = query;
  const searchArray = [
      filterKey<${name}>(filter, 'id'),
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
     .join("\n")}
  ].filter(Boolean) as Prisma.${name}WhereInput[];

  const orderArray = [
          orderKey('id', 'id', orderBy),

${fields
  .map((f: Field, idx: number) => {
    if (f.sortAble && !f.isRelation) {
      return `
         orderKey('${f.name.toLowerCase()}', '${f.name.toLowerCase()}', orderBy)${
        idx + 1 < fields.length ? "," : ""
      }
     `;
    }
  })
  .join("\n")}
    ].filter(Boolean) as Prisma.${name}OrderByWithRelationInput[];


  return {
    ...paginateOrNot({ limit, page }, query?.id),
        orderBy: orderArray,
    where: {
      AND: searchArray,
    },
  } as Prisma.${name}FindManyArgs;
};

export const select${name.at(0)?.toUpperCase() + name.slice(1)}OBJ = () => {
  const selectArgs: Prisma.${name}Select = {
   id:true,
    ${fields
      .map((f: Field) => {
        if (!f.isRelation && f.filterAble) {
          return `
    ${f.name}:true   
     `;
        }
      })
      .join(",")}
  };
  return selectArgs;
};
export const get${
    name.at(0)?.toUpperCase() + name.slice(1)
  }ArgsWithSelect = () => {
  return {
    select: select${name.at(0)?.toUpperCase() + name.slice(1)}OBJ(),
  } satisfies Prisma.${name.at(0)?.toUpperCase() + name.slice(1)}FindManyArgs;
};

    
  
  `;
};
