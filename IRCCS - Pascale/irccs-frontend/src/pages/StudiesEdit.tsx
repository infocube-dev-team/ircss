import { Table, TableRow, TableCell, TableBody, Button, TextField } from "@mui/material";
import { useCallback, useEffect, useState } from "react"; 
import { getStudiesById } from "../service/FhirHandler"; 
import { useLocation } from "react-router-dom";

import './Organizations.css';

interface Study {
    id: string;
    title: string;
    status: string;
    sponsor: string;
    principalInvestigator: string;
    documentsLink: string;
    numberOfPatientsEnrolled: string;
}

const StudiesEdit = () => {
    const { state } = useLocation(); 
    const [study, setStudy] = useState<Study>(); 
    const [modifiedStudy, setModifiedStudy] = useState<Study>({ 
        id: '',
        title: '',
        status: '',
        sponsor: '',
        principalInvestigator: '',
        documentsLink: '',
        numberOfPatientsEnrolled: ''
    });
    const [isSaveButtonDisabled, setIsSaveButtonDisabled] = useState(true);

    // Definizione della funzione per ottenere gli studi dal backend
    const fetchStudies = useCallback(async () => {
        try {
            const studiesResponse: Study[] = await getStudiesById(state.id); // Chiamata alla funzione getStudiesById per ottenere gli studi con l'ID specificato

            setStudy(studiesResponse[0]); 
            setModifiedStudy(studiesResponse[0]); 
        } catch (error) {
            console.error(error); 
        }
    }, [state.id]);

    // Utilizzo di useEffect per effettuare la chiamata ai dati quando il componente viene montato
    useEffect(() => {
        fetchStudies();
    }, [fetchStudies]);

    // Definizione della funzione per gestire l'input dell'utente
    const handleInputChange = (fieldName: keyof Study, value: string) => {
        setModifiedStudy((prevStudy) => {
            const updatedStudy = {
                ...prevStudy!,
                [fieldName]: value,
            };

            const isModified = Object.keys(updatedStudy).some((key) => {
                return updatedStudy[key as keyof Study] !== study?.[key as keyof Study];
            });

            setIsSaveButtonDisabled(!isModified);

            return updatedStudy;
        });
    };

    // Definizione della funzione per salvare le modifiche dello studio
    const handleSaveChanges = () => {
        if (modifiedStudy) {
            saveModifiedStudy(modifiedStudy); 
        }
    };

    // Definizione della funzione per salvare lo studio modificato
    const saveModifiedStudy = (modifiedStudy: Study) => {
        //Da implementare
    };

    return (
        <div className="centered-page">
            <h1>{study?.title}</h1>
            <Table className="table-container">
                <TableBody>
                    <TableRow className="category-row">
                        <TableCell className="centered-cell cell-wrap">Titolo</TableCell>
                        <TableCell className="centered-cell cell-wrap">
                            <TextField
                                name="title"
                                value={modifiedStudy?.title}
                                onChange={(e) => handleInputChange("title", e.target.value)}
                                variant="outlined"
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow className="category-row">
                        <TableCell className="centered-cell cell-wrap">Stato</TableCell>
                        <TableCell className="centered-cell cell-wrap">
                            <TextField
                                name="status"
                                value={modifiedStudy?.status}
                                onChange={(e) => handleInputChange("status", e.target.value)}
                                variant="outlined"
                            />
                        </TableCell>
                    </TableRow>
                    <TableRow className="category-row">
                        <TableCell className="centered-cell cell-wrap">Sponsor</TableCell>
                        <TableCell className="centered-cell cell-wrap">
                            <TextField
                                name="sponsor"
                                value={modifiedStudy?.sponsor}
                                onChange={(e) => handleInputChange("sponsor", e.target.value)}
                                variant="outlined"
                            />
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
            <div className="save-button">
                <Button variant="contained" onClick={handleSaveChanges} disabled={isSaveButtonDisabled}>
                    Salva modifiche
                </Button>
            </div>
        </div>
    );
};

export default StudiesEdit;
