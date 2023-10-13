import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import styled from "styled-components";
import { allUsersRoute, host } from "../utils/APIRoutes";
import ChatContainer from "../components/ChatContainer";
import Contacts from "../components/Contacts";
import Welcome from "../components/Welcome";

export default function Chat() {
   const navigate = useNavigate();
   const socket = useRef();
   const [contacts, setContacts] = useState([]);
   const [currentChat, setCurrentChat] = useState(undefined);
   const [currentUser, setCurrentUser] = useState(undefined);

   useEffect(() => {
      const fetchData = async () => {
         if (!localStorage.getItem("chat-app-user")) {
            navigate("/login");
         } else {
            setCurrentUser(
               await JSON.parse(localStorage.getItem("chat-app-user"))
            );
         }
      };

      fetchData();

      if (currentUser) {
         socket.current = io(host);
         socket.current.emit("add-user", currentUser._id);
      }

      if (currentUser) {
         const fetchContacts = async () => {
            try {
               const data = await axios.get(
                  `${allUsersRoute}/${currentUser._id}`
               );
               const contactsData = data.data;

               // Update the avatar of each contact to the first letter of their name
               const contactsWithInitials = contactsData.map((contact) => {
                  if (!contact.isAvatarImageSet && contact.name) {
                     contact.avatar = contact.name[0].toUpperCase();
                  }
                  return contact;
               });

               setContacts(contactsWithInitials);
            } catch (error) {
               // Log the error to the console or handle it in your application
               console.error("Error fetching contacts:", error);
            }
         };

         fetchContacts();
      }
   }, [navigate, currentUser]);

   const handleChatChange = (chat) => {
      setCurrentChat(chat);
   };

   return (
      <>
         <Container>
            <div className='container'>
               <Contacts
                  contacts={contacts}
                  changeChat={handleChatChange}
               />
               {currentChat === undefined ? (
                  <Welcome />
               ) : (
                  <ChatContainer
                     currentChat={currentChat}
                     socket={socket}
                  />
               )}
            </div>
         </Container>
      </>
   );
}

const Container = styled.div`
   height: 100vh;
   width: 100vw;
   display: flex;
   flex-direction: column;
   justify-content: center;
   gap: 1rem;
   align-items: center;
   background-color: #131324;
   .container {
      height: 85vh;
      width: 85vw;
      background-color: #00000076;
      display: grid;
      grid-template-columns: 25% 75%;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
         grid-template-columns: 35% 65%;
      }
   }
`;
