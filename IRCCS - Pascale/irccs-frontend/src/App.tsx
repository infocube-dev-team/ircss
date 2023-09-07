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
import OrganizationsEdit from './pages/OrganizationsEdit';
import BackOffice from './pages/BackOffice';
import Studies from './pages/Studies';
import StudiesEdit from './pages/StudiesEdit';
import NewCenter from './pages/NewCenter';

function App() {
  return (
    <Grid style={{ textAlign: "center" }}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/hospital-options" element={<HospitalOptions/>} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/new-patient" element={<NewPatient />} />
            <Route path="/organizations/new-center" element={<NewCenter />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/organizations/edit" element={<OrganizationsEdit />} />
            <Route path="/backoffice" element={<BackOffice />} />
            <Route path="/studies" element={<Studies />} />
            <Route path="/studies/edit" element={<StudiesEdit />} />
          </Routes>
        </Layout>
      </Router>
    </Grid>
  );
}

export default App;
