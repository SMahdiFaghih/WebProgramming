import { Button, Icon, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import FormApi from '../api/formApis';
import RequestContent from '../dialogs/RequestContent';
import { GetFormSubmitsRes, Request } from '../types/form';
import { notif } from '../Utils/notification.utils';
import { useQuery } from '../Utils/routing.utils';

const formsService = new FormApi();

function SubmitList() {
  const [state, setState] = useState<GetFormSubmitsRes>({
    forms: []
  })
  const query = useQuery();
  useEffect(() => {
    getFormSubmits();
  }, []);

  function getFormSubmits() {
    const formId = query.get('id');
    if (!formId) {
      notif('danger', 'Error', 'we must have formId in them params')
      return;
    }
    formsService.getFormSubmits({ formId: Number(formId) })
      .then((data) => {
        setState(data)
      })
      .catch(e => {
        notif('danger', 'Error', e.message)
      })
  }

  const acceptReq = (req:Request)=>{
    formsService.resolveRequests({formId:Number(req.form_id), student_email: req.student_email, result:'Accepted' })
    .then(data=>{
      getFormSubmits();
    })
    .catch(e=>{
      notif('danger', 'Error', e.message)
    })
  }

  const denyReq = (req:Request) => {
    formsService.resolveRequests({formId:Number(req.form_id), student_email: req.student_email, result:'Rejected' })
    .then(data=>{
      getFormSubmits();
    })
    .catch(e=>{
      notif('danger', 'Error', e.message)
    })
  }

  const actionButton = (req:Request) =>{
    if(req.result === 'Pending'){
      return(
        <>
      <TableCell>
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => acceptReq(req)}>
          <Icon>done</Icon>
        </IconButton>
      </TableCell>
      <TableCell >
        <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => denyReq(req)}>
          <Icon>clear</Icon>
        </IconButton>
      </TableCell>
      </>
      )
    }
  }

  const [openContentDialog, setOpenContentDialog] = useState(false);
  const toggleContent = () => {
      setOpenContentDialog(!openContentDialog);
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
        <h2>Submit List</h2>
        <div className="desciption mb-4">Submits to your Form can be seen in the table bellow, you can also accept o deny them.</div>
        <TableContainer component={Paper}>
          <Table className="table-form" aria-label="forms table">
            <TableHead>
              <TableRow>
                <TableCell>No.</TableCell>
                <TableCell>Form No.</TableCell>
                <TableCell>Student Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Content</TableCell>
                <TableCell></TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {state.forms.map((r, i) => (
                <TableRow key={r.form_id}>
                  <TableCell>{i + 1}</TableCell>
                  <TableCell>{r.form_id}</TableCell>
                  <TableCell>{r.student_email}</TableCell>
                  <TableCell>{r.result}</TableCell>
                  <TableCell>
                    <Button color="inherit" onClick={toggleContent}>
                      Open
                    </Button>
                    <RequestContent open={openContentDialog} onClose={toggleContent} formId={r.form_id} student_email={r.student_email}></RequestContent>
                  </TableCell>
                 {actionButton(r)}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
}

export default SubmitList;
