import { Button, Icon, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormApi from '../api/formApis';
import { GetFormSubmitsRes } from '../types/form';
import { notif } from '../Utils/notification.utils';
import { useQuery } from '../Utils/routing.utils';

const formsService = new FormApi();

function SubmitList() {
  const [state , setState] = useState<GetFormSubmitsRes>({
      forms: []
  })
  const query = useQuery();
  useEffect(() => {
    getFormSubmits();
  }, []);

  function getFormSubmits(){
    const formId = query.get('id');
    if(!formId) {
        notif('danger','Error','we must have formId in them params' )
        return;
      }
    formsService.getFormSubmits({formId: Number(formId)})
    .then((data)=>{
        setState(data)
    })
    .catch(e=>{
      notif('danger','Error', e.message)
    })
  }

  return (
    <>
      <div className="p-3">
      <Link className="text-link" to="/dashboard/forms-list">
        <Button>
          <Icon>keyboard_arrow_left</Icon>
          <span>back</span>
        </Button>
      </Link>
      </div>
      <div className="forms-list">
          <div className="desciption mb-4">Submits to your Form can be seen in the table bellow, you can also accept o deny them.</div>
          <TableContainer component={Paper}>
              <Table className="table" aria-label="forms table">
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
                  </TableBody>
              </Table>
          </TableContainer>
      </div> 
      </>
  );
}

export default SubmitList;
