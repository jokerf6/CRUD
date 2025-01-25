"use client";
import { useState } from "react";

export default function ModelCreator() {
  const [modelName, setModelName] = useState("");
  const [project, setProject] = useState("");
  const [fields, setFields] = useState([
    {
      name: "",
      type: "String",
      isRelation: false,
      relatedModel: "",
      relationType: "oneToMany",
      required: true,
      filterAble: true,
      sortAble: true,
    },
  ]);

  const addField = () => {
    setFields([
      ...fields,
      {
        name: "",
        type: "String",
        isRelation: false,
        relatedModel: "",
        relationType: "oneToMany",
        required: true,
        filterAble: true,
        sortAble: true,
      },
    ]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const modelDefinition = {
      name: modelName,
      project:project,
      fields: fields.map((field) => ({
        name: field.name,
        type: field.isRelation ? field.relatedModel : field.type,
        isRelation: field.isRelation,
        relationType: field.relationType,
      })),
    };

    console.log(modelDefinition);

    try {
      await fetch("/api/create-model", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(modelDefinition),
      });
      console.log("a777777777");
    } catch (error) {
      console.error("Error:", error);
      alert(`An error occurred while creating the model: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-4">
      <input
        type="text"
        placeholder="Project"
        value={project}
        onChange={(e) => setProject(e.target.value)}
        className="block w-full p-2 border rounded text-black h-[40px]"
      />
      
      <input
        type="text"
        placeholder="Model Name"
        value={modelName}
        onChange={(e) => setModelName(e.target.value)}
        className="block w-full p-2 border rounded text-black h-[40px]"
      />

      {fields.map((field, index) => (
        <div key={index} className="flex flex-col gap-2">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Field Name"
              value={field.name}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].name = e.target.value;
                setFields(newFields);
              }}
              className="p-2 border rounded text-black flex-1"
            />
            <select
              value={field.type}
              onChange={(e) => {
                const newFields = [...fields];
                newFields[index].type = e.target.value;
                setFields(newFields);
              }}
              className="p-2 border rounded bg-green-500 h-[40px]"
              disabled={field.isRelation}
            >
              <option>String</option>
              <option>Int</option>
              <option>Boolean</option>
              <option>DateTime</option>
              <option>Image</option>
            </select>
            <div className="flex gap-2 items-start flex-col">
              <label className=" flex items-center">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].required = e.target.checked;
                    setFields(newFields);
                  }}
                  style={{
                    width: "20px", // Adjust the width as needed
                    height: "20px", // Adjust the height as needed
                  }}
                  className="mr-2 text-center"
                />
                Required
              </label>
              <label className=" flex items-center">
                <input
                  type="checkbox"
                  checked={field.filterAble}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].filterAble = e.target.checked;
                    setFields(newFields);
                  }}
                  style={{
                    width: "20px", // Adjust the width as needed
                    height: "20px", // Adjust the height as needed
                  }}
                  className="mr-2"
                />
                Filter
              </label>
              <label className=" flex items-center">
                <input
                  type="checkbox"
                  checked={field.sortAble}
                  onChange={(e) => {
                    const newFields = [...fields];
                    newFields[index].sortAble = e.target.sortAble;
                    setFields(newFields);
                  }}
                  className="mr-2"
                  style={{
                    width: "20px", // Adjust the width as needed
                    height: "20px", // Adjust the height as needed
                  }}
                />
                Sort
              </label>
            </div>
          </div>

          <div className="flex gap-2 items-center">
            <label>
              <input
                type="checkbox"
                checked={field.isRelation}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].isRelation = e.target.checked;
                  setFields(newFields);
                }}
                className="mr-2"
              />
              Relation
            </label>
            {field.isRelation && (
              <div className=" flex gap-2">
                <label>
                  <input
                    type="checkbox"
                    checked={field.relationType === "oneToOne"}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[index].relationType = "oneToOne";
                      setFields(newFields);
                    }}
                    className="mr-2"
                  />
                  One-to-One
                </label>
                <label>
                  <input
                    type="checkbox"
                    checked={field.relationType === "oneToMany"}
                    onChange={() => {
                      const newFields = [...fields];
                      newFields[index].relationType = "oneToMany";
                      setFields(newFields);
                    }}
                    className="mr-2"
                  />
                  One-to-Many
                </label>
              </div>
            )}
            {field.isRelation && (
              <input
                type="text"
                placeholder="Related Model"
                value={field.relatedModel}
                onChange={(e) => {
                  const newFields = [...fields];
                  newFields[index].relatedModel = e.target.value;
                  setFields(newFields);
                }}
                className="p-2 border rounded text-black flex-1"
              />
            )}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addField}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Add Field
      </button>

      <button type="submit" className="bg-green-500 text-white p-2 rounded">
        Create Model
      </button>
    </form>
  );
}
