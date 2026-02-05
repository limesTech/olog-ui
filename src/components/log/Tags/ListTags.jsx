import { useState } from "react";
import { Backdrop, CircularProgress } from "@mui/material";
import { ologApi } from "api/ologApi";
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined';
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import GenericIconList from "components/shared/GenericIconList";

/**
 * Example usage of API endpoints to fetch and list tags.
 * This component fetches tags and displays them using GenericIconList.
 */

const TagList = () => {
    const { data: tags, isLoading, error } = ologApi.endpoints.getTags.useQuery();
    const [selectedTag, setSelectedTag] = useState(null);

    if (isLoading) return <div>Loading tags...</div>;
    if (error) return <div>Error loading tags.</div>;

    const items = tags?.map((tag) => ({
        key: tag.id || tag.name,
        name: tag.name,
        description: tag.description || null,
        icon: <LocalOfferOutlinedIcon />,
        selected: selectedTag === tag.name,
        onClick: () => setSelectedTag(tag.name),
        secondaryAction: (
            <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                    e.stopPropagation();
                    // Handle delete action here
                    console.log(`Delete tag ${tag.name}`);
                }}
            >
                <DeleteIcon />
            </IconButton>
        )
    }));

    return (
        <GenericIconList items={items} title="Tags" dense />
    );
};

const ListTags = () => {
    const [createInProgress, setCreateInProgress] = useState(false);
    return (
        <>
            <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={createInProgress}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
            <TagList />
        </>
    );
};

export default ListTags;