import ModelCreator from "./components/ModelCreator";

export default function AdminPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl mb-4">Create New Model</h1>
      <ModelCreator />
    </div>
  );
}
