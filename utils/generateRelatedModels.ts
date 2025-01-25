import { Field } from "../types/field.type";
import pluralize from "pluralize";
import path from "path";
import fs from "fs";
import { camelToSnake } from "@/functions/transforms/fromCamelToSnake.transform";

export const generateRelatedModels = (
  name: string,
  fields: Field[],
  prismaSchemaPath: string
) => {
  fields
    .filter((f) => f.isRelation)
    .forEach((field) => {
      const relatedModel = field.type;
      const relationName = `${name}To${relatedModel}`;
      const isOneToOne = field.relationType === "oneToOne";

      const inverseField = isOneToOne
        ? pluralize.singular(name.toLowerCase())
        : pluralize(name.toLowerCase());

      const relatedModelPath = path.join(
        prismaSchemaPath,
        `${relatedModel.toLowerCase()}.prisma`
      );

      // Create file if it doesn't exist
      if (!fs.existsSync(relatedModelPath)) {
        fs.writeFileSync(
          relatedModelPath,
          `model ${relatedModel} {\n  id Int @id @default(autoincrement())\n}`
        );
      }

      // Read content and split into lines
      const content = fs.readFileSync(relatedModelPath, "utf8");
      const lines = content.split("\n");

      // Check if the relation already exists
      if (!content.includes(`@relation("${relationName}")`)) {
        const relationType = isOneToOne ? `${name}?` : `${name}[]`;
        const inverseRelation = `  ${inverseField} ${relationType} @relation("${relationName}")`;

        // Find index of @@map or add it if not present
        let mapIndex = lines.findIndex((line) => line.includes("@@map"));
        if (mapIndex === -1) {
          lines.push(`  @@map("${camelToSnake(relatedModel)}")`);
          mapIndex = lines.length - 1;
        }

        // Insert the inverse relation before @@map
        lines.splice(mapIndex, 0, inverseRelation);

        // Write the updated content back to the file
        fs.writeFileSync(relatedModelPath, lines.join("\n"));
      }
    });
};
