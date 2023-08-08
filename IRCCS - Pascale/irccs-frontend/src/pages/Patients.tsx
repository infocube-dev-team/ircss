import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import './HospitalOptions.css';
import { Button, Paper, TextField, Typography } from '@mui/material';
import { getPatientFromId } from '../service/FhirHandler';

const Patients: React.FC = () => {
    const location = useLocation();
    const state = location.state as { ospedale: string };
    const [patientId, setPatientId] = useState<string>('');
    const [patientData, setPatientData] = useState<{ id: any; name: any; identifier: any; } | null>(null);

    const fetchPatient = async () => {
        try {
            const patientData = await getPatientFromId(patientId);
            setPatientData(patientData);
        } catch (error) {
            console.error(error);
        }
    };

    const handleKeyPress = (event: { key: string; }) => {
        if (event.key === 'Enter') {
            fetchPatient();
        }
    };

    return (
        <div className="centered-page">
            <h1>Seleziona il paziente da analizzare da {state.ospedale}</h1>
            <TextField
                label="ID paziente"
                variant="standard"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                onKeyPress={handleKeyPress}
            />
            <Button variant="outlined" onClick={fetchPatient} sx={{ m: 2 }}>
                Cerca paziente
            </Button>

            {patientData && typeof patientData === 'object' && (
                <Paper className="patient-paper">
                    <Typography variant="h6" gutterBottom>
                        Dettagli del paziente
                    </Typography>
                    <Typography variant="body1">
                        <b>ID:</b> {patientData.id}
                    </Typography>
                    <Typography variant="body1">
                        <b>Nome:</b> {patientData.name[0]?.given[0]} 
                    </Typography>
                    <Typography variant="body1">
                        <b>Cognome:</b> {patientData.name[0]?.family}
                    </Typography>
                </Paper>
            )}

        </div>
    );
}

export default Patients;
