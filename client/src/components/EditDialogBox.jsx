import { Dialog, DialogTitle, DialogContent, Slide } from "@mui/material";
import AddTransactionWidget from "../scenes/widgets/AddTransactionWidget";
import { forwardRef } from "react";

// Transition effect for the dialog
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

/**/
/*
NAME
    EditDialogBox - A reusable Edit Dialog Box component.

SYNOPSIS
    EditDialogBox({ open, handleClose, row, type })
        open          --> boolean indicating whether the dialog box is open.
        handleClose   --> function to call when the dialog box is closed. 
        row           --> the row data associated with the edit action. 
        type          --> the type of the edit action. This is either "income" or
                          "expense".

DESCRIPTION
    A reusable Edit Dialog Box component. This component is used to display an
    AddTransactionWidget component inside a dialog box. It is used to edit a
    transaction in the database.

RETURNS
    The Edit Dialog Box component.
*/
const EditDialogBox = ({ open, handleClose, row, type }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Edit Transaction"}</DialogTitle>
      <DialogContent>
        {/* Render the AddTransactionWidget component inside the dialog box */}
        <AddTransactionWidget
          transaction={type}
          editRow={row}
          handleCloseEdit={handleClose}
          pageType="update"
        />
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogBox;
