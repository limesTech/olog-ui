import { Box, useTheme, useMediaQuery } from "@mui/material";
import { ListLogbooks, CreateLogbooks } from "components/log/Logbooks";
import { ListTags, CreateTags } from "components/log/Tags";
import { ListProperties, CreateProperties } from "components/log/Properties";
import { ListLevels, CreateLevels } from "components/log/Levels";

const Section = ({ ListComponent, CreateComponent }) => (
  <Box
    display="flex"
    flexDirection="column"
    gap={2}
    flexGrow={1} // makes all sections take equal width
    minWidth={0} // avoids overflow when the viewport is tiny
  >
    <Box
      flexGrow={1}
      overflow="auto"
      sx={{
        minHeight: 250,
        //  border: "3px solid",
        borderColor: "divider"
      }}
    >
      <ListComponent />
    </Box>
    <Box>{<CreateComponent />}</Box>
  </Box>
);

/* -------------------------------------------------
   Main view
   ------------------------------------------------- */
const CreateLogView = () => {
  const theme = useTheme();
  const isSmUp = useMediaQuery(theme.breakpoints.up("sm"));

  return (
    <Box
      display="flex"
      flexDirection={isSmUp ? "row" : "column"}
      justifyContent="center"
      alignItems="stretch"
      gap={4}
      width="100%"
      px={2}
      sx={{ minHeight: "50vh" }}
    >
      {/* ───── Logbooks ───── */}
      <Section
        ListComponent={ListLogbooks}
        CreateComponent={CreateLogbooks}
      />

      {/* ───── Tags ───── */}
      <Section
        ListComponent={ListTags}
        CreateComponent={CreateTags}
      />

      {/* ───── Properties ───── */}
      <Section
        ListComponent={ListProperties}
        CreateComponent={CreateProperties}
      />

      {/* ───── Levels ───── */}
      <Section
        ListComponent={ListLevels}
        CreateComponent={CreateLevels}
      />
    </Box>
  );
};

export default CreateLogView;
