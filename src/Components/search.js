import { Flex } from "@chakra-ui/layout";
import Search2Icon from "../Icon/user.svg";
import addIcon from "../Icon/add.svg";
import { FormControl, FormLabel, Input, Image } from "@chakra-ui/react";
import { useFormik } from "formik";
import { searchUser, createChat } from "../Utilities/api";
export default function Search(props) {
  var id1 = sessionStorage.getItem("id");
  id1 = id1.split('"')[1];
  const formik = useFormik({
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      searchUser(values.name)
        .then((res) => {
          createChat(id1, res._id).then((chat) => {
            props.getChang({
              chatID: chat._id,
              name: values.name,
              userID: res._id,
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  });
  return (
    <Flex bgColor="white" borderRadius="20px" h="70px" alignItems="center">
      <form
        onSubmit={formik.handleSubmit}
        style={{ width: "85%", marginLeft: "5%" }}
      >
        <Flex w="100%">
          <FormControl>
            <Flex alignItems="center" h="100%">
              <FormLabel mr="0px" mb="0px">
                <Image src={Search2Icon} ml="10px" />
              </FormLabel>
              <Input
                w="210px"
                name="name"
                placeholder="search for user name..."
                onChange={formik.handleChange}
                value={formik.values.name}
                border="none"
                focusBorderColor="#ffffff"
              />
            </Flex>
          </FormControl>
          <button type="submit">
            <Image src={addIcon} />
          </button>
        </Flex>
      </form>
    </Flex>
  );
}
