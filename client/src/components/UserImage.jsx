import { Box } from "@mui/material";

/**/
/*
NAME

  UserImage - A component that renders a user image.

SYNOPSIS  
  UserImage({ image, size = "60px" })
    image --> The image of the user.
    size --> The size of the image.

DESCRIPTION
  A component that renders a user image. It is used to display the image of the
  user in the navbar.

RETURNS
  The UserImage component.
*/
/**/
const UserImage = ({ image, size = "60px" }) => {
  return (
    <Box width={size} height={size}>
      {/* render the image */}
      <img
        style={{ objectFit: "cover", borderRadius: "50%" }}
        width={size}
        height={size}
        alt="user"
        src={`http://localhost:3001/assets/${image}`}
      />
    </Box>
  );
};

export default UserImage;
