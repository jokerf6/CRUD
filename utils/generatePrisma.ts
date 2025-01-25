import { camelToSnake } from "@/functions/transforms/fromCamelToSnake.transform";
import { Field } from "../types/field.type";

const mapFieldType = (type: never) => {
  const typeMap = {
    Image: "String",
  };
  return typeMap[type] || type;
};
export const generatePrismaModel = (name: string, fields: Field[]) => {
  const normalFields = fields.filter((f) => !f.isRelation);
  const relationFields = fields.filter((f) => f.isRelation);

  return `
  model ${name} {
    id        Int     @id @default(autoincrement())
    
    // Normal Fields
    ${normalFields
      .map((f) => {
        const type = mapFieldType(f.type as never);
        const columnName = camelToSnake(f.name);
        const mapAttr = columnName !== f.name ? `@map("${columnName}")` : "";
        return `${f.name} ${type} ${mapAttr}`.trim();
      })
      .join("\n  ")}
  
    // Direct Relations
    ${relationFields
      .map((f) => {
        const relationName = `${name}To${f.type}`;
        const isOneToOne = f.relationType === "oneToOne";
        return `${f.name} ${f.type}${
          isOneToOne ? "?" : ""
        } @relation(name: "${relationName}", fields: [${f.name.toLowerCase()}Id], references: [id])\n  ${f.name.toLowerCase()}Id ${
          isOneToOne ? "Int?" : "Int"
        }`;
      })
      .join("\n\n  ")}
  
    @@map("${camelToSnake(name)}")
  }`;
};
