import { useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { ologApi } from "api/ologApi";
import AutoStoriesOutlinedIcon from '@mui/icons-material/AutoStoriesOutlined';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericIconList from "components/shared/GenericIconList";

/**
 * Example usage of API endpoints to fetch and list logbooks.
 * This component fetches logbooks and displays them using GenericIconList.
 */

const LogbookList = () => {
  const { data: logbooks, isLoading, error } = ologApi.endpoints.getLogbooks.useQuery();
  const [selectedLogbook, setSelectedLogbook] = useState(null);

  if (isLoading) return <div>Loading logbooks...</div>;
  if (error) return <div>Error loading logbooks.</div>;

  const items = logbooks?.map((logbook) => ({
    key: logbook.id || logbook.name,
    name: logbook.name,
    description: logbook.description || null,
    icon: <AutoStoriesOutlinedIcon />,
    selected: selectedLogbook === logbook.name,
    onClick: () => setSelectedLogbook(logbook.name),
    secondaryAction: (
      <IconButton
        edge="end"
        aria-label="delete"
        onClick={(e) => {
          e.stopPropagation();
          // Handle delete action here
          console.log(`Delete logbook ${logbook.name}`);
        }}
      >
        <DeleteIcon />
      </IconButton>
    )
  }));

  return (
      <GenericIconList items={items} title="Logbooks" dense />
  );
};


const ListLogbooks = () => {
  const [createInProgress, setCreateInProgress] = useState(false);
  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={createInProgress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <LogbookList />
    </>
  );
};
export default ListLogbooks;
