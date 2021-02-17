import { Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import React, { useState } from 'react';
import Paper from '@material-ui/core/Paper';
import FormApi from '../api/formApis';
import { Form } from '../types/form';
import { Link } from 'react-router-dom';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });

function createData(name:string, calories:number, fat:number, carbs:number, protein:number) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const formsService = new FormApi();

function FormsList() {
    const classes = useStyles();
    const [state , setState] = useState<{forms:Form[]}>({
        forms: []
    })
    function getForms(){
        formsService.getUserForms()
        .then((data)=>{
            // setState(data.forms as Form[])
        })
        .catch(e=>console.error(e))
    }

    function editForm(formId:string){
        
    }

    function closeForm(formId:string){
        formsService.closeForm({formId})
        .then((data)=>{
            getForms();
        })
        .catch(e=>console.error(e))
    }

    return (
        <div className="FormsList">
            <div className="desciption mb-4">Your Forms can be seen in the table bellow, you can also Edit or Delete them.</div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Dessert (100g serving)</TableCell>
                        <TableCell align="right">Calories</TableCell>
                        <TableCell align="right">Fat&nbsp;(g)</TableCell>
                        <TableCell align="right">Carbs&nbsp;(g)</TableCell>
                        <TableCell align="right">Protein&nbsp;(g)</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {rows.map((row) => (
                        <TableRow key={row.name}>
                        <TableCell component="th" scope="row">
                            {row.name}
                        </TableCell>
                        <TableCell align="right">{row.calories}</TableCell>
                        <TableCell align="right">{row.fat}</TableCell>
                        <TableCell align="right">{row.carbs}</TableCell>
                        <TableCell align="right">{row.protein}</TableCell>
                        <Link to="/dashboard/submit-list">
                            <IconButton edge="start"  color="inherit" aria-label="menu" onClick={()=>editForm('id')}>
                                <Icon>list</Icon>
                            </IconButton>
                        </Link>
                        <Link to="/dashboard/edit-form">
                            <IconButton edge="start"  color="inherit" aria-label="menu" onClick={()=>editForm('id')}>
                                <Icon>edit</Icon>
                            </IconButton>
                        </Link>
                        <IconButton edge="start"  color="inherit" aria-label="menu" onClick={()=>closeForm('id')}>
                            <Icon>close</Icon>
                        </IconButton>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    );
}

export default FormsList;
