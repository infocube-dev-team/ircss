import React from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';

import './Tabella.css'

interface TableColumn {
  header: string;
}

type TableRows = Array<string | number>;

interface TabellaProps {
  headers: TableColumn[];
  rows: TableRows[];
  showHeaders?: boolean;
  showEditColumn?: boolean;
}

const Tabella = (props: TabellaProps) => {
  const { headers, rows, showHeaders, showEditColumn } = props;

  // Calcola la lunghezza massima di righe
  const maxRowLength = Math.max(...rows.map((row) => row.length));

  const navigate = useNavigate();

  const handleEdit = (id: string) => {
    navigate('edit', { state: { id } });
  };
  
  return (
        <Table className="table-container">
          {(showHeaders == null || showHeaders) && (
            <TableHead>
              <TableRow>
                {headers.map((column, index) => (
                  <TableCell className="centered-cell cell-wrap" key={index}>{column.header}</TableCell>
                ))}
                {(showEditColumn == null || showEditColumn) && <TableCell className="centered-cell cell-wrap">Edit</TableCell>}
              </TableRow>
            </TableHead>
          )}
          <TableBody>
            {rows.map((row, rowIndex) => {
              // Aggiungi celle vuote per righe incomplete
              if (row.length < maxRowLength) {
                const diff = maxRowLength - row.length;
                row = [...row, ...Array(diff).fill(undefined)];
              }
              return (
                <TableRow key={rowIndex}>
                  {row.map((cell, cellIndex) => (
                    <TableCell className="centered-cell cell-wrap" key={cellIndex}>{cell}</TableCell>
                  ))}
                  {(showEditColumn == null || showEditColumn) && (
                    <TableCell className="centered-cell cell-wrap">
                      <IconButton onClick={() => handleEdit(row[0] as string)}>
                        <EditIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
  );
};

export default Tabella;