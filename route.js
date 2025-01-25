"use server";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
import { generateDTO } from "./utils/generateDto";
import { generatePrismaArgs } from "./utils/generatePrismaArgs";
import {generateService} from "./utils/generateService";
import {generateController} from "./utils/generateController";
import { generateModule } from "./utils/generateModule";
import {generatePrismaModel} from "./utils/generatePrisma";
import {generateRelatedModels} from "./utils/generateRelatedModels";

export async function POST(req) {

  try {
    const { name, fields,project } = await req.json();
   console.log(project);
   
    if (!project || !fs.existsSync(project)) {
    return new Response(JSON.stringify({ success: false }), { status: 400 });
    }

    const GlobalPath = path.join(project, `src/_modules/${name.toLowerCase()}`);
    const prismaSchemaPath = path.join(project, "prisma/schema");
    const moduleDir = GlobalPath;
    const dtoDir = path.join(GlobalPath, "dto");
    const prismaArgsDir = path.join(GlobalPath, "prisma-args");
    const serviceDir = GlobalPath;
    const controllerDir = GlobalPath;
       

    // Generate Prisma Model
    const modelDefinition = generatePrismaModel(name, fields);
    const modelFilePath = path.join(
      prismaSchemaPath,
      `${name.toLowerCase()}.prisma`
    );
    fs.writeFileSync(modelFilePath, modelDefinition);

    // // Generate Related Models
    generateRelatedModels(name, fields, prismaSchemaPath);

    //  Generate DTO
    if (!fs.existsSync(dtoDir)) {
      fs.mkdirSync(dtoDir, { recursive: true });
    }
    const dtoContent = generateDTO(name, fields); 
    const dtoPath = path.join(dtoDir, `${name.toLowerCase()}.dto.ts`);
    fs.writeFileSync(dtoPath, dtoContent);

    //  Generate Prisma args
    if (!fs.existsSync(prismaArgsDir)) {
      fs.mkdirSync(prismaArgsDir, { recursive: true });
    }
    const prismaArgsContent = generatePrismaArgs(name, fields);
    const prismaArgsPath = path.join(prismaArgsDir, `${name.toLowerCase()}.prisma.args.ts`);
    fs.writeFileSync(prismaArgsPath, prismaArgsContent);

    //  Generate Service
    if (!fs.existsSync(serviceDir)) {
      fs.mkdirSync(serviceDir, { recursive: true });
    }
    const serviceContent = generateService(name, fields);
    const servicePath = path.join(serviceDir, `${name.toLowerCase()}.service.ts`);
    fs.writeFileSync(servicePath, serviceContent);

    //  Generate Controller
    if (!fs.existsSync(controllerDir)) {
      fs.mkdirSync(controllerDir, { recursive: true });
    }
    const controllerContent = generateController(name, fields);
    const controllerPath = path.join(serviceDir, `${name.toLowerCase()}.controller.ts`);
    fs.writeFileSync(controllerPath, controllerContent);

    //  Generate Module
    if (!fs.existsSync(moduleDir)) {
      fs.mkdirSync(moduleDir, { recursive: true });
    }
    const moduleContent = generateModule(name, fields);
    const modulePath = path.join(moduleDir, `${name.toLowerCase()}.module.ts`);
    fs.writeFileSync(modulePath, moduleContent);


    execSync("npx prisma format", { stdio: "inherit" });
    execSync("npx prisma generate", { stdio: "inherit" });
    execSync(`npx prisma migrate dev --name create_${name}`, {
      stdio: "inherit",
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Migration failed",
        details: error.message,
      }),
      { status: 500 }
    );
  }
}
