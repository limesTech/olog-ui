import { useState } from "react";
import { ologApi } from "api/ologApi";
import { useForm } from "react-hook-form";
import { Backdrop, CircularProgress } from "@mui/material";

const TagState = {
  ACTIVE: "Active",
  INACTIVE: "Inactive"
};

const CreateTags = () => {
  const [createInProgress, setCreateInProgress] = useState(false);
  const [tags, setTags] = useState("");
  const [error, setError] = useState("");
  const [createTags, { isLoading }] = ologApi.endpoints.createTags.useMutation();

  const handleChange = (e) => {
    setTags(e.target.value);
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
    
    if (!tags.trim()) {
      setError("Tag name cannot be empty.");
      setCreateInProgress(false);
      return;
    }

    // Split tags by comma, trim whitespace, and filter out empty tags
    const tagsArray = tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (tagsArray.length === 0) {
      setError("Please enter at least one valid tag.");
      setCreateInProgress(false);
      return;
    }

    // Create proper body structure
    const body = tagsArray.map((tag) => ({
      name: tag,
      state: TagState.ACTIVE
    }));

    try {
      await createTags({ tags: body }).unwrap();
      setTags("");
      setError("");
    } catch (err) {
      setError("Failed to create tags.");
      console.error("Error creating tags:", err);
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
          value={tags}
          onChange={handleChange}
          placeholder="Enter new tags (separated by commas)"
          aria-label="New tags"
          disabled={isLoading || createInProgress}
        />
        <button
          type="submit"
          disabled={isLoading || createInProgress}
        >
          Add Tags
        </button>
        {error && (
          <span style={{ color: "red", marginLeft: "8px" }}>{error}</span>
        )}
      </form>
    </>
  );
};

export default CreateTags;