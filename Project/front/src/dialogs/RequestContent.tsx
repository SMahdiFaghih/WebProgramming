import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import FormApi from "../api/formApis";
import { GetRequestDataRes } from "../types/form";
import { notif } from "../Utils/notification.utils";

export interface RequestContentDialogProps {
    open: boolean;
    formId: number;
    student_email:string;
    onClose: () => void;
}

const formsService = new FormApi();
  
function RequestContentDialog(props: RequestContentDialogProps) {
    const { onClose, formId, student_email, open } = props;
    const [ state, setState ] = useState<GetRequestDataRes>();


    const handleClose = () => {
      onClose();
    };

    useEffect(() => {
        getRequestData();
    }, []);
  
    const getRequestData = ()=>{
        formsService.getRequestData({formId, student_email})
        .then(data=>{
            console.log(data)
            setState(data)
        }).catch(e=>{
            notif('danger','Error', e.message)
        })
    }

    return (
    <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Request Content</DialogTitle>
        <DialogContent>
            <div className="mb-4">form's data:</div>
            {
                state?.formContent.map(f =>
                    <div className="mb-3">
                        <span className="font-weight-bold mr-3">{f.field_name}</span>
                        <span>{f.data}</span>
                    </div>
                )
            }
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose} color="primary">
                Close
            </Button>
        </DialogActions>
    </Dialog>
    );
  }

export default RequestContentDialog;