import { Flex, Stack } from "@chakra-ui/layout";
import userIcon from "../Icon/user.svg";
import { useFormik } from "formik";
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Image,
  Text,
} from "@chakra-ui/react";
import { LockIcon } from "@chakra-ui/icons";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import { userLogin } from "../Utilities/api";
import { useNavigate } from "react-router-dom";
import usr_input_bg from "../Icon/username_input.svg";
import pwd_input_bg from "../Icon/pwd_input.svg";
import login_bg from "../Icon/login.svg";
export default function Login() {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      name: "",
      pwd: "",
    },
    onSubmit: (values) => {
      userLogin(values.name, values.pwd)
        .then((res) => {
          console.log(res);
          sessionStorage.clear();
          sessionStorage.setItem("token", JSON.stringify(res.token));
          sessionStorage.setItem("name", JSON.stringify(res.name));
          sessionStorage.setItem("id", JSON.stringify(res._id));
          navigate("/chat");
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  return (
    <Stack bgColor="#F3EEEB" h="100vh" w="100vw" alignItems="center">
      <Stack w="50vw" mt="15vh" alignItems="center">
        <Text color="#130832" fontSize="xx-large" fontWeight="bold" mb="10vh">
          Welcome to ChatApp
        </Text>
        <form onSubmit={formik.handleSubmit}>
          <Stack>
            <CustomControll bgImg={usr_input_bg}>
              <Flex alignItems="center" h="100%">
                <CustomLabel>
                  <Image src={userIcon} ml="10px" />
                  <Text>Username</Text>
                </CustomLabel>
                <Input
                  w="190px"
                  name="name"
                  onChange={formik.handleChange}
                  value={formik.values.name}
                  border="none"
                  color="#ffffff"
                  fontSize="18px"
                  fontWeight="bolder"
                  focusBorderColor="#598983"
                />
              </Flex>
            </CustomControll>
            <CustomControll bgImg={pwd_input_bg}>
              <Flex alignItems="center" h="100%">
                <CustomLabel>
                  <LockIcon
                    color="#132644"
                    boxSize="20px"
                    ml="20px"
                    mr="10px"
                  />
                  <Text>Password</Text>
                </CustomLabel>
                <Input
                  w="190px"
                  name="pwd"
                  type="password"
                  onChange={formik.handleChange}
                  value={formik.values.pwd}
                  border="none"
                  color="#ffffff"
                  fontSize="18px"
                  fontWeight="bolder"
                  focusBorderColor="#598983"
                />
              </Flex>
            </CustomControll>
            <Button
              type="submit"
              mt="15vh"
              bgImg={login_bg}
              borderRadius="30px"
              h="60px"
              color="white"
              fontWeight="bolder"
              fontSize="25px"
            >
              Login
            </Button>
          </Stack>
        </form>
        <Flex color="#130832">
          <Text mr="20px">Don’t have an account?</Text>
          <Link to="/register">Sign up</Link>
        </Flex>
      </Stack>
    </Stack>
  );
}
const CustomLabel = styled(FormLabel)`
  font-size: 18px;
  color: #132644;
  font-weight: bold;
  margin-right: 5px;
  margin-bottom: 0px;
  display: flex;
  align-items: center;
`;
const CustomControll = styled(FormControl)`
  border-radius: 30px;
  height: 60px;
  width: 350px;
  margin-bottom: 20px;
`;
