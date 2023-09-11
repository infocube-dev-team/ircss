import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Grid } from '@mui/material';
import Dashboard from './pages/Dashboard/Dashboard';
import HospitalOptions from './pages/Options/HospitalOptions/HospitalOptions';
import Layout from './pages/Layout';
import Reports from './pages/Reports';
import NewPatient from './pages/NewPatient/NewPatient';
import Patients from './pages/Patients/Patients';
import Organizations from './pages/Organizations/Organizations';
import BackOffice from './pages/BackOffice/BackOffice';
import Studies from './pages/Studies/Studies';
import StudiesEdit from './pages/Studies/edit/StudiesEdit';
import NewCenter from './pages/Organizations/NewCenter';
import OrganizationsEdit from "./pages/Organizations/edit/OrganizationsEdit";

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
