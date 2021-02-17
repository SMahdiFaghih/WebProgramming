import { Icon, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormApi from '../api/formApis';
import { GetUserFormsRes } from '../types/form';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });


const formsService = new FormApi();

function FormsList() {
    const classes = useStyles();
    const [state , setState] = useState<GetUserFormsRes>({
        forms: []
    })


  useEffect(() => {
      getForms()
  }, []);

    function getForms(){
        formsService.getUserForms()
        .then((data)=>{
            setState(data)
        })
        .catch(e=>console.error(e))
    }

    function closeForm(formId:number){
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
                <Table className={classes.table} aria-label="forms table">
                    <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Status</TableCell>
                        <TableCell></TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                    {state.forms.map((f, i) => (
                        <TableRow key={f.title}>
                            <TableCell>{i+1}</TableCell>
                            <TableCell>{f.title}</TableCell>
                            <TableCell>
                                <div className="table-description">
                                {f.description}
                                </div>
                               </TableCell>
                            <TableCell>{f.status}</TableCell>
                            <TableCell>
                            <Link to={`/dashboard/submit-list?id=${f.form_id}`}>
                                    Responses
                            </Link>
                            </TableCell>
                            <TableCell >
                            <IconButton edge="start"  color="inherit" aria-label="menu" onClick={()=>closeForm(f.form_id)}>
                                <Icon>close</Icon>
                            </IconButton>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    );
}

export default FormsList;
