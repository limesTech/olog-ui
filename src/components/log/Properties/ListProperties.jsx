import { useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { ologApi } from "api/ologApi";
import TuneOutlinedIcon from '@mui/icons-material/TuneOutlined';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericIconList from "components/shared/GenericIconList";

/**
 * Example usage of API endpoints to fetch and list properties.
 * This component fetches properties and displays them using GenericIconList.
 */

const PropertiesList = () => {
    const { data: properties, isLoading, error } = ologApi.endpoints.getProperties.useQuery();
    const [selectedProperties, setSelectedProperties] = useState(null);

    if (isLoading) return <div>Loading properties...</div>;
    if (error) return <div>Error loading properties.</div>;

    const items = properties?.map((properties) => ({
        key: properties.id || properties.name,
        name: properties.name,
        description: properties.description || null,
        icon: <TuneOutlinedIcon />,
        selected: selectedProperties === properties.name,
        onClick: () => setSelectedProperties(properties.name),
        secondaryAction: (
            <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete action here
                    console.log(`Delete properties ${properties.name}`);
                }}
            >
                <DeleteIcon />
            </IconButton>
        )
    }));

    return (
        <GenericIconList items={items} title="Properties" dense />
    );
};

const ListProperties = () => {
    const [createInProgress, setCreateInProgress] = useState(false);
    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={createInProgress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <PropertiesList />
        </>
    );
};

export default ListProperties;