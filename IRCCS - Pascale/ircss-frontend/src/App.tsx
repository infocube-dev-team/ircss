import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Grid } from '@mui/material';
import Dashboard from './pages/Dashboard';
import HospitalOptions from './pages/HospitalOptions';
import Layout from './pages/Layout';
import Reports from './pages/Reports';
import NewPatient from './pages/NewPatient';
import Patients from './pages/Patients';
import Organizations from './pages/Organizations';

function App() {
  return (
    <Grid style={{ textAlign: "center" }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hospital-options" element={<HospitalOptions />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/organizations" element={<Organizations />} />
          </Routes>
        </Layout>
      </Router>
    </Grid>
  );
}

export default App;
