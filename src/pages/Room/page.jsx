import React, { Suspense, useEffect, useRef, useState } from 'react'
import { PageContainer } from '../../components/ui/page-container'
import { SiteHeader } from '../../components/ui/site-header'
import RoomHeader from './components/Header'
import { Button } from '../../components/ui/button'
import SharedCodeEditor from './components/SharedCodeEditor'
import CollaborationPanel from './components/CollabPanel'
import { initSocket } from '@/socket'
import { Navigate, useLocation } from 'react-router-dom'

import { toast } from 'sonner'
import { ACTIONS } from '@/../actions'
import FloatingWidget from './components/FloatingWidget'
import { ErrorBoundary } from 'react-error-boundary';
import { ErrorFallback } from '@/components/ui/ErrorFallback'


const Room = () => {


    const location = useLocation();
    const [clients, setClients] = useState([]);

    const [roomId] = location.pathname.split('/').slice(-1); // Extracting room ID from the URL
    const username = location.state?.username
    console.log(roomId, username); // This will log the room ID from the URL

    const socketRef = useRef(null);

    useEffect(() => {

        const initRef = async () => {
            // socketRef?.current?.on('connect_error', (err) => {
            //     console.error('Socket connection error:', err);
            //     toast.error('Socket connection error. Please try again later.');
            //     navigator('/');
            // });
            // socketRef?.current?.on('connect_failed', (err) => {
            //     console.error('Socket connection error:', err);
            //     toast.error('Socket connection error. Please try again later.');
            //     navigator('/');
            // });
            //   EMITING EVENT FOR JOINING ROOM
            if (!username) {
                toast.error('Please enter a username before joining the room.');
                return;
            }


            socketRef.current = await initSocket(ACTIONS.JOIN, {
                roomId,
                username
            });

            //listening for event
            socketRef.current.on(ACTIONS.JOINED, ({ clients, username }) => { // getting all clients in the room
                console.log('👥 JOINED EVENT:', { clients, username });
                // Update the clients state with the new list of clients
                // This will trigger a re-render of the CollaborationPanel component
                // and display the updated list of users in the room
                // avoid duplicate join messages for itself user who created room
                if (username !== location.state.username) {
                    toast.success(`${username} joined the room 🎉`)
                }
                setClients(clients);
            });

            socketRef.current.on(ACTIONS.DISCONNECTED, ({ socketId, username }) => {
                toast.success(`${username} left the room 👋`);
                setClients((prev) => prev.filter((client) => client.socketId !== socketId));
            });

        }

        initRef();
        //clean funtions
        return () => {
            socketRef.current.off(ACTIONS.JOINED);
            socketRef.current.off(ACTIONS.DISCONNECTED);
        }
    }, [roomId, username]);

    console.log(clients);

    if (location.state?.username === undefined || location.state?.username === null || location.state?.username === '') {
        toast.error('Please enter a username before joining the room.');
        return <Navigate to="/" replace />;
    }

    return (

        <>
            <RoomHeader />
            <div className="flex flex-col md:flex-row justify-between gap-2 h-screen bg-gray-900 text-sm font-sans relative p-2 ">

                <div className='w-full md:w-3/4 lg:w-4/5 xl:w-4/5 2xl:w-4/5 h-full overflow-hidden mx-auto pt-6 rounded-2xl'>

                    {socketRef.current && <SharedCodeEditor socketRef={socketRef} roomId={roomId} username={username} />}
                </div>


                <div className=' mt-2 md:mt-1 md:mx-4 overflow-hidden rounded-lg md:rounded-xl  '>
                    <ErrorBoundary FallbackComponent={<ErrorFallback />} >
                        {socketRef.current && <CollaborationPanel
                            socket={socketRef?.current}
                            clients={clients || []}
                            roomId={roomId}
                            currentUsername={location.state?.username || 'Guest'} />
                        }
                    </ErrorBoundary>

                </div>
            </div>
            <div>
                {/* <FloatingWidget /> */}
            </div>

        </>
    )
}

export default Room







