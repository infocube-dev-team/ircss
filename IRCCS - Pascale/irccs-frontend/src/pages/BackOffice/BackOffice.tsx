import React from 'react';
import { Link } from 'react-router-dom';
import { Typography, Grid, Paper, Box } from '@mui/material';
import './BackOffice.css';

interface BackOfficeItem {
  title: string;
  description: string;
}

const selezionaComponente = (name: string): string => {
  switch (name) {
    case 'Gestione Utenti':
      return '/users';
    case 'Gestione Studi':
      return '/studies';
    case 'Gestione Centri':
      return '/organizations';
    case 'Gestione Comitati Etici':
      return '/gestione-comitati-etici';
    case 'Gestione Gruppi di Coordinamento':
      return '/gestione-gruppi-coordinamento';
    case 'Gestione Servizi CRO':
      return '/gestione-servizi-cro';
    case 'Gestione Servizi Revisione Radiologica':
      return '/gestione-servizi-revisione-radiologica';
    case 'Richieste Farmaco':
      return '/richieste-farmaco';
    default:
      return '/';
  }
};

const BackOffice: React.FC = () => {
  const items: BackOfficeItem[] = [
    {
      title: 'Gestione Utenti',
      description: 'Per gestire gli utenti e le loro autorizzazioni per lo studio',
    },
    {
      title: 'Gestione Studi',
      description: 'Per gestire gli studi ed accedere ai report per studio',
    },
    {
      title: 'Gestione Centri',
      description: 'Per gestire i centri e le loro autorizzazioni ed informazioni per studio',
    },
    {
      title: 'Gestione Comitati Etici',
      description: 'Per gestire i comitati etici',
    },
    {
      title: 'Gestione Gruppi di Coordinamento',
      description: 'Gestione dei gruppi di coordinamento Centri',
    },
    {
      title: 'Gestione Servizi CRO',
      description: 'Gestione servizi per i CRO',
    },
    {
      title: 'Gestione Servizi Revisione Radiologica',
      description: 'Gestione servizi Revisione Radiologica',
    },
    {
      title: 'Richieste Farmaco',
      description: 'Report Richiesta Farmaco',
    },
  ];

  return (
    <div className="backoffice-container">
      <div className="backoffice-content">
        <Typography variant="h4" align="center" gutterBottom>
          Back Office
        </Typography>
        <Grid container spacing={3}>
          {items.map((item) => (
            <Grid item xs={12} sm={3} key={item.title}>
              <Link to={selezionaComponente(item.title)} className="backoffice-item">
                <Paper className="backoffice-paper" elevation={4}>
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                    <Typography variant="h5" gutterBottom>
                      {item.title}
                    </Typography>
                    <div className="backoffice-description">
                      {item.description}
                    </div>
                  </Box>
                </Paper>
              </Link>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default BackOffice;
