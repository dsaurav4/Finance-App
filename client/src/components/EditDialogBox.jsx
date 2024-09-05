import { Dialog, DialogTitle, DialogContent, Slide } from "@mui/material";
import AddTransactionWidget from "../scenes/widgets/AddTransactionWidget";
import { forwardRef } from "react";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
