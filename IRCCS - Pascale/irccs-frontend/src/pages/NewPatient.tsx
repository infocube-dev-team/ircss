import { Button, FormControl, Grid, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import React from 'react';
import { useLocation } from 'react-router-dom';
import './HospitalOptions.css';

const NewPatient: React.FC = () => {
  const location = useLocation();
  const state = location.state as { ospedale: string };
  const [group, setGroup] = React.useState('eleggibili');
  const [center, setCenter] = React.useState('');

  const handleGroupChange = (event: SelectChangeEvent) => {
    setGroup(event.target.value as string);
  };

  const handleCenterChange = (event: SelectChangeEvent) => {
    setCenter(event.target.value as string);
  };

  return (
    <Grid container justifyContent="center" alignItems="center" className="centered-page">
      <Grid item xs={12} textAlign="center">
        <h4>Selezione del gruppo di appartenenza del paziente e controllo, presso {state.ospedale}</h4>
      </Grid>
      <Grid item xs={6}>
        <FormControl fullWidth>
          <p>Seleziona il gruppo di appartenenza</p>
          <Select
            labelId="group"
            id="group"
            value={group}
            onChange={handleGroupChange}
            displayEmpty
          >
            <MenuItem value={1}>eleggibili</MenuItem>
            <MenuItem value={2}>non eleggibili</MenuItem>
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <p>Seleziona il centro per il quale si inserisce il paziente</p>
          <Select
            labelId="center"
            id="center"
            value={center}
            onChange={handleCenterChange}
            displayEmpty
          >
            <MenuItem value={1}>Centro 1</MenuItem>
            <MenuItem value={2}>Centro 2</MenuItem>
            <MenuItem value={3}>Centro 3</MenuItem>
            <MenuItem value={4}>Centro 4</MenuItem>
            <MenuItem value={5}>Centro 5</MenuItem>
          </Select>
        </FormControl>
        <Button variant="outlined" sx={{ m: 2 }}>
          Procedi all'inserimento
        </Button>
      </Grid>

    </Grid>
  );
}

export default NewPatient;
