import { useState } from "react";
import { ologApi } from "api/ologApi";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";


const CreateLevels = () => {
  const [createInProgress, setCreateInProgress] = useState(false);
  const [levels, setLevels] = useState("");
  const [error, setError] = useState("");
  const [createLevels, { isLoading }] = ologApi.endpoints.createLevels.useMutation();

  const handleChange = (e) => {
    setLevels(e.target.value);
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
    
    if (!levels.trim()) {
      setError("Levels name cannot be empty.");
      setCreateInProgress(false);
      return;
    }

    // Split levels by comma, trim whitespace, and filter out empty levels
    const levelsArray = levels
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (levelsArray.length === 0) {
      setError("Please enter at least one valid levels.");
      setCreateInProgress(false);
      return;
    }

    // Create proper body structure
    const body = levelsArray.map((levels) => ({
      name: levels,
      state: Levelstate.ACTIVE
    }));

    try {
      await createLevels({ levels: body }).unwrap();
      setLevels("");
      setError("");
    } catch (err) {
      setError("Failed to create levels.");
      console.error("Error creating levels:", err);
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
          value={levels}
          onChange={handleChange}
          placeholder="Enter new levels (separated by commas)"
          aria-label="New levels"
          disabled={isLoading || createInProgress}
        />
        <button
          type="submit"
          disabled={isLoading || createInProgress}
        >
          Add Levels
        </button>
        {error && (
          <span style={{ color: "red", marginLeft: "8px" }}>{error}</span>
        )}
      </form>
    </>
  );
};

export default CreateLevels;