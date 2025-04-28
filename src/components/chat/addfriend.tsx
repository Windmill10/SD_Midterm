import { FormEvent, useState } from "react";
import { findUserByEmail } from "../../common/findUser";
import {Button, TextField, Box} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import { Alert, AlertColor } from "@mui/material";
export const AddFriend = () => {
  const [email, setEmail] = useState("");
  const [open, setOpen] = useState(false);
  const [alertType, setAlertType] = useState<AlertColor>("success");
  const [alertMessage, setAlertMessage] = useState("");
  const handleAddFriend = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const user = await findUserByEmail(email);
      if (user) {

        //await addFriendToUser(user);
        setAlertType("success");
        setAlertMessage(`Successfully added ${user.displayName} as a friend`);
      } else {
        setAlertType("error");
        setAlertMessage("User not found");
      }
      setEmail("");
    } catch (error) {
      setAlertType("error");
      setAlertMessage("An error occurred while adding friend");
      console.error("Error adding friend:", error);
    } finally {
      setEmail("");
      setOpen(true);
    }
  };

  const handleClose = () => {
    setOpen(false);
  }


  return (
    <div>
      <Box onSubmit={handleAddFriend} component="form" sx={{ mt: 2, ml: 0.2, width: '100%', alignItems: 'center',justifyItems: 'center' ,display: 'flex', flexDirection: 'horizontal' }}>
        {/*<input type="text" placeholder="Enter email" value={email} onChange={(e => setEmail(e.target.value))}/>*/}
        <TextField id="outlined-basic" label="Email" variant="outlined" value={email} onChange={(e => setEmail(e.target.value))}/>
        <Button type="submit" sx={{
          marginLeft: 2,
          bgcolor: "extraColors.success",
          "&:hover": { bgcolor: 'extraColors.successDark' },
        }}
                variant="contained"
        >
          Add Friend</Button>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={alertType}
            variant="filled"
            sx={{ width: '100%' }}
          >
            {alertMessage}
          </Alert>
        </Snackbar>
      </Box>

    </div>
  );

}