import { useState } from "react";
import { ologApi } from "api/ologApi";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";


const CreateProperties = () => {
  const [createInProgress, setCreateInProgress] = useState(false);
  const [properties, setProperties] = useState("");
  const [error, setError] = useState("");
  const [createProperties, { isLoading }] = ologApi.endpoints.createProperties.useMutation();

  const handleChange = (e) => {
    setProperties(e.target.value);
    setError("");
  };

  const form = useForm({
    defaultValues: {
      name: ""
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault(); // Correct way to prevent default form submission
    setCreateInProgress(true);
    
    if (!properties.trim()) {
      setError("Properties name cannot be empty.");
      setCreateInProgress(false);
      return;
    }

    // Split properties by comma, trim whitespace, and filter out empty properties
    const propertiesArray = properties
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (propertiesArray.length === 0) {
      setError("Please enter at least one valid properties.");
      setCreateInProgress(false);
      return;
    }

    // Create proper body structure
    const body = propertiesArray.map((properties) => ({
      name: properties,
      state: Propertiestate.ACTIVE
    }));

    try {
      await createProperties({ properties: body }).unwrap();
      setProperties("");
      setError("");
    } catch (err) {
      setError("Failed to create properties.");
      console.error("Error creating properties:", err);
    } finally {
      setCreateInProgress(false);
    }
  };

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={createInProgress || isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", gap: "8px", alignItems: "center" }}
      >
        <input
          type="text"
          value={properties}
          onChange={handleChange}
          placeholder="Enter new properties (separated by commas)"
          aria-label="New properties"
          disabled={isLoading || createInProgress}
        />
        <button
          type="submit"
          disabled={isLoading || createInProgress}
        >
          Add Properties
        </button>
        {error && (
          <span style={{ color: "red", marginLeft: "8px" }}>{error}</span>
        )}
      </form>
    </>
  );
};

export default CreateProperties;