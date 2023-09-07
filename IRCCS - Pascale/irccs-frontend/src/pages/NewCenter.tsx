import {Box, Button, FormControl, Grid, Input, MenuItem, Select, SelectChangeEvent} from '@mui/material';


import React from "react";


const NewCenter: React.FC = () => {

    return (
        <div className="centered-page">
            <Box sx={{ overflow: "auto" }}>
                <b> Aggiungi nuovo centro </b>
            </Box>
        </div>
    );
}


export default NewCenter;