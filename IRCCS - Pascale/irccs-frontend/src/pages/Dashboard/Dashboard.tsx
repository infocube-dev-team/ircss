import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableRow, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import './Dashboard.css';


interface Oggetto {
  id: number;
  nome: string;
  descrizione: string;
  categoria: string;
}

const arrayOggetti: Oggetto[] = [
  {
    id: 1,
    nome: "Other Hospital",
    descrizione: "Other Hospital 1",
    categoria: "Altri",
  },
  {
    id: 2,
    nome: "Pascale",
    descrizione: "Ospedale Pascale 1",
    categoria: "Polmonari",
  },
  {
    id: 3,
    nome: "Other Hospital",
    descrizione: "Other Hospital 2",
    categoria: "Altri",
  },
  {
    id: 4,
    nome: "Ospedale di Cura",
    descrizione: "Cura",
    categoria: "Altri",
  },
  {
    id: 5,
    nome: "Pascale",
    descrizione: "Ospedale Pascale 2",
    categoria: "Polmonari",
  },
  {
    id: 6,
    nome: "Other Hospital",
    descrizione: "Other Hospital 3",
    categoria: "Altri",
  },
  {
    id: 7,
    nome: "Ospedale di Pazienza",
    descrizione: "Cura i pazienti",
    categoria: "Cardiovascolari",
  },
  {
    id: 8,
    nome: "MITO-16b Phase 3",
    descrizione: "A MULTICENTER PHASE || RANDOMIZED STUDY",
    categoria: "uro-ginecologici"
  }
];

const Dashboard = () => {
  const [expandedCategories, setExpandedCategories] = useState<{ [categoria: string]: boolean }>({});
  const navigate = useNavigate();

  const toggleCategory = (categoria: string) => {
    setExpandedCategories((prevExpandedCategories) => ({
      ...prevExpandedCategories,
      [categoria]: !prevExpandedCategories[categoria]
    }));
  };

  const oggettiPerCategoria: { [categoria: string]: Oggetto[] } = {};
  arrayOggetti.forEach((oggetto) => {
    if (oggettiPerCategoria[oggetto.categoria]) {
      oggettiPerCategoria[oggetto.categoria].push(oggetto);
    } else {
      oggettiPerCategoria[oggetto.categoria] = [oggetto];
    }
  });

  const handleLinkClick = (name: string) => {
    navigate('/hospital-options', { replace: true, state: { ospedale: name } });
  };

  return (
    <div>
      <h4>Studi clinici</h4>
      <TableContainer component={Paper} className="table-container">
        <Table >
          <TableBody>
            {Object.entries(oggettiPerCategoria).map(([categoria, oggetti]) => (
              <React.Fragment key={categoria}>
                <TableRow className="category-row" onClick={() => toggleCategory(categoria)}>
                  <TableCell align="center" colSpan={12} className="category-cell centered-cell">
                    {categoria}
                  </TableCell>
                </TableRow>
                {expandedCategories[categoria] &&
                  oggetti.map((oggetto) => (
                    <TableRow key={oggetto.id}>
                      <TableCell className="centered-cell link-cell highlighted-cell" colSpan={3} onClick={() => handleLinkClick(oggetto.nome)}>
                        {oggetto.nome}
                      </TableCell>
                      <TableCell align="left" className="centered-cell" colSpan={9}>
                        {oggetto.descrizione}
                      </TableCell>
                    </TableRow>
                  ))}
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );

};

export default Dashboard;
