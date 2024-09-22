import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
} from "@mui/material";
import { forwardRef } from "react";

// Transition effect for the dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**/
/*
NAME
    DeleteDialogBox - A reusable Delete Dialog Box component.

SYNOPSIS
    DeleteDialogBox({ open, handleClose, handleDelete, row, type })
        open          --> boolean indicating whether the dialog box is open. 
        handleClose   --> function to call when the dialog box is closed.  
        handleDelete  --> function to call when the delete button is clicked. It takes the row and type as arguments. 
        row           --> the row data associated with the delete action. 
        type          --> the type of the delete action. This is either "income" or 
                          "expense". 

DESCRIPTION
    A reusable Delete Dialog Box component. This component is used to display a
    DeleteTransactionWidget component inside a dialog box. It is used to delete a
    transaction in the database.

RETURNS
    The Delete Dialog Box component.
*/
/**/
const DeleteDialogBox = ({ open, handleClose, handleDelete, row, type }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Delete Transaction"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are you sure you want to delete this {type ? type : "category"}?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="contained" onClick={handleClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={() => handleDelete(row, type)}
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialogBox;
