import { Flex, Stack } from "@chakra-ui/layout";
import withAuth from "../Utilities/withAuth";
import Search from "../Components/search";
import { chatList, findID, getMessage, sendMessage } from "../Utilities/api";
import { useEffect, useState, useRef, useCallback } from "react";
import {
  Avatar,
  Text,
  Divider,
  Tabs,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Image,
} from "@chakra-ui/react";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import send from "../Icon/send.svg";
import { io } from "socket.io-client";
export default function Chat() {
  const socket = useRef();
  const scrollRef = useRef();
  const [userList, setList] = useState([]);
  const [currentChat, setCurrent] = useState([]);
  const [receiverName, setReceiverName] = useState("");
  const [receiverID, setReceiverID] = useState("");
  const [chatroom, setChatRoom] = useState("");
  const [text, setText] = useState("");
  const [message, setMessage] = useState("");
  const [notification, setNotification] = useState([]);
  var id1 = sessionStorage.getItem("id");
  id1 = id1.split('"')[1];
  useEffect(() => {
    if (id1) {
      socket.current = io("http://localhost:5844");
      socket.current.emit("addUser", id1);
    }
    return () => {
      socket.current?.disconnect();
    };
  }, []);
  //send message
  useEffect(() => {
    socket.current.emit("sendMessage", { ...message, receiverID });
  }, [message]);

  //receive message and notification
  useEffect(() => {
    socket.current.on("getMessage", (res) => {
      if (chatroom !== res.chatID) return;
      setCurrent((prev) => [...prev, res]);
    });
    socket.current.on("getNotification", (res) => {
      const chatOpen = receiverID == res.senderID;
      if (chatOpen) {
        setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.current.off("getMessage");
      socket.current.off("getNotification");
    };
  }, [chatroom]);

  //scroll
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);
  useEffect(() => {
    setList([]);
    if (id1) {
      chatList(id1)
        .then((res) => {
          res.forEach((value) => {
            var member =
              value.members[0] == id1 ? value.members[1] : value.members[0];
            var namelist = { chatID: value._id, name: "", userID: member };
            findID(member).then((res) => {
              namelist.name = res.name;
              setList((userList) => [...userList, namelist]);
            });
          });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  const updateChat = (receiver, thisNotification) => {
    getMessage(receiver.chatID)
      .then((res) => {
        setChatRoom(receiver.chatID);
        setReceiverName(receiver.name);
        setReceiverID(receiver.userID);
        setCurrent(res);
      })
      .catch((err) => {
        console.log(err);
      });
    if (thisNotification?.length > 0) {
      resetNotification(thisNotification, notification);
    }
  };
  const sendText = (text) => {
    sendMessage(chatroom, id1, text).then((res) => {
      setCurrent((prev) => [...prev, res]);
      setMessage(res);
      setText("");
    });
  };
  const unreadNotification = (notification) => {
    return notification.filter((e) => e.isRead == false);
  };
  const resetNotification = useCallback((thisNotification, allNotification) => {
    const newNotification = allNotification.map((e) => {
      let notification;
      thisNotification.forEach((n) => {
        if (n.senderID == e.senderID) {
          notification = { ...n, isRead: true };
        } else {
          notification = e;
        }
      });
      return notification;
    });
    setNotification(newNotification);
  }, []);
  const FriendList = (props) => {
    // const [lastMessage, setLastMessage] = useState("");
    const all_notification = unreadNotification(notification);
    const notification_num = all_notification?.filter(
      (n) => n.senderID == props.receiver.userID
    );
    // useEffect(() => {
    //   getMessage(props.receiver.chatID).then((res) => {
    //     const lastMsg = res[res?.length - 1];
    //     setLastMessage(lastMsg);
    //   });
    // }, [message, notification]);
    return (
      <Stack
        cursor="pointer"
        onClick={() => updateChat(props.receiver, notification_num)}
      >
        <Flex alignItems="center" w="100%">
          <Avatar name={props.receiver.name}></Avatar>
          <Stack flexGrow="1" ml="20px">
            <Text fontSize="16px">{props.receiver.name}</Text>
            {/* {lastMessage && (
              <Text color="#ADADAD" fontSize="14px">
                {lastMessage.text}
              </Text>
            )} */}
          </Stack>
          <Stack alignItems="flex-end">
            {/* {lastMessage && (
              <Text fontSize="12px">
                {moment(lastMessage.charAt).calendar()}
              </Text>
            )} */}
            {notification_num?.length > 0 ? (
              <Flex
                bgColor="#FFB6B5"
                height="25px"
                width="25px"
                borderRadius="50%"
                alignItems="center"
                justifyContent="center"
                color="white"
                fontSize="17px"
              >
                {notification_num?.length}
              </Flex>
            ) : (
              <Flex height="20px" width="20px" />
            )}
          </Stack>
        </Flex>
        <Divider />
      </Stack>
    );
  };

  const Message = (props) => (
    <Flex
      ref={scrollRef}
      flexDir={props.message.senderID == id1 ? "row-reverse" : "row"}
      alignItems="flex-end"
    >
      <Text
        bgColor={props.message.senderID == id1 ? "#FFB6B5" : "#F0F1F5"}
        maxW="40%"
        p="8px"
        borderRadius="10px"
      >
        {props.message.text}
      </Text>
      <Text m="5px" color="#ADADAD" fontSize="12px">
        {moment(props.message.createdAt).calendar()}
      </Text>
    </Flex>
  );

  return withAuth(
    <Flex h="100%" w="100vw">
      <Stack w="450px" p="20px" h="100%">
        <Search getChang={(friend) => setList((pre) => [friend, ...pre])} />
        <Stack
          bgColor="white"
          borderRadius="20px"
          mt="5px"
          height="calc(100vh - 218px)"
          p="20px"
          overflowY="scroll"
        >
          {userList &&
            userList.map((user, index) => (
              <FriendList key={index} receiver={user} />
            ))}
        </Stack>
      </Stack>
      {receiverName && (
        <Stack w="calc(100vw - 470px)" pt="20px" h="100%">
          <Tabs>
            <TabList
              bgColor="white"
              borderRadius="20px"
              h="70px"
              alignItems="center"
              pr="20px"
            >
              <Flex flexGrow="1" ml="20px" alignItems="center">
                <Avatar name={receiverName} boxSize="40px"></Avatar>
                <Text ml="10px">{receiverName}</Text>
              </Flex>

              <Tab _selected={{ color: "#FFB6B5" }}>Chat</Tab>
              <Tab _selected={{ color: "#FFB6B5" }}>Into The Cloud</Tab>
            </TabList>
            <TabPanels
              mt="13px"
              bgColor="white"
              borderRadius="20px"
              height="calc(100vh - 223px)"
            >
              <TabPanel h="100%">
                <Stack h="100%" justifyContent="space-between">
                  <Stack h="80%" overflowY="scroll">
                    {currentChat &&
                      currentChat.map((message, index) => (
                        <Message key={index} message={message} />
                      ))}
                  </Stack>
                  <Flex flexDir="row" alignItems="center" mr="10px">
                    <InputEmoji
                      value={text}
                      onEnter={() => sendText(text)}
                      onChange={setText}
                      placeholder="Type a message"
                    />
                    <button onClick={() => sendText(text)}>
                      <Image src={send} />
                    </button>
                  </Flex>
                </Stack>
              </TabPanel>
              <TabPanel>cloud</TabPanel>
            </TabPanels>
          </Tabs>
        </Stack>
      )}
    </Flex>
  );
}
