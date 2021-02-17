import { Icon, IconButton,Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormApi from '../api/formApis';
import { GetAllFormsRes } from '../types/form';

const useStyles = makeStyles({
    table: {
      minWidth: 650,
    },
  });


const formsService = new FormApi();

function AllForms() {
    const classes = useStyles();
    const [state , setState] = useState<GetAllFormsRes>({
        forms: []
    })

    useEffect(() => {
        getAllForms()
    }, []);

    function getAllForms(){
        formsService.getAllForms()
        .then((data)=>{
            setState(data)
        })
        .catch(e=>console.error(e))
    }

    return (
        <div className="FormsList">
            <div className="desciption mb-4">All Forms can be seen in the table bellow, you can fill the one's you like.</div>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="forms table">
                    <TableHead>
                    <TableRow>
                        <TableCell>No.</TableCell>
                        <TableCell>Title</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Submit</TableCell>
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
                            <TableCell>
                                <Link to={`/dashboard/submit-form?id=${f.form_id}`}>
                                    <IconButton>
                                        <Icon>keyboard_arrow_right</Icon>
                                    </IconButton>
                                </Link>
                            </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div> 
    );
}

export default AllForms;
