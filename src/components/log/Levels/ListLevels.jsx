import { useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { ologApi } from "api/ologApi";
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericIconList from "components/shared/GenericIconList";

/**
 * Example usage of API endpoints to fetch and list levels.
 * This component fetches levels and displays them using GenericIconList.
 */

const LevelList = () => {
    const { data: levels, isLoading, error } = ologApi.endpoints.getLevels.useQuery();
    const [selectedLevels, setSelectedLevels] = useState(null);

    if (isLoading) return <div>Loading levels...</div>;
    if (error) return <div>Error loading levels.</div>;

    const items = levels?.map((levels) => ({
        key: levels.id || levels.name,
        name: levels.name,
        description: levels.description || null,
        icon: <BarChartOutlinedIcon />,
        selected: selectedLevels === levels.name,
        onClick: () => setSelectedLevels(levels.name),
        secondaryAction: (
            <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete action here
                    console.log(`Delete levels ${levels.name}`);
                }}
            >
                <DeleteIcon />
            </IconButton>
        )
    }));

    return (
        <GenericIconList items={items} title="Levels" dense />
    );
};

const ListLevels = () => {
    const [createInProgress, setCreateInProgress] = useState(false);
    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={createInProgress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <LevelList />
        </>
    );
};

export default ListLevels;