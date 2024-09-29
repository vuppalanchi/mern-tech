import React, { useEffect, useState } from 'react';
import UsersList from '../components/UsersList';

import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

//upender code
const Users = () => {
    // const DUMMY_USERS = [
    //     {
    //         id: 'u1',
    //         name: 'Upender Vuppalanchi',
    //         email: 'upentest@gmail.com',
    //         password: 'testers'
    //     }
    // ];

    console.log('here in Users js file');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState();
    //const [loadedUsers, setLoadedUsers] = useState();
    //console.log(' use state entries ' + useState().entries().)
    const [loadedUsers, setLoadedUsers] = useState([]);
    //const [loadedUsers,setLoadedUsers] = useState<charactersDataType>([]);
    

    
        useEffect( () => {

        const sendRequest = async() => {
            setIsLoading(true);

            try{
                const response = await fetch('http://localhost:5000/api/users');
                const responseData = await response.json();
                console.log('Upender - response recieved is ' + responseData.users[0].name);

                if(!response.ok){
                    throw new Error(responseData.message);
                }

                setLoadedUsers(responseData.users);
                setIsLoading(false);
    
            }catch(err){

                setError(err.message);
            }
            setIsLoading(false);
        };
        sendRequest();
    },[]);

    
    const errorHandler =() => {
        setError(null);
    };

    return (
    <React.Fragment>
        <ErrorModal error={error} onClear={errorHandler} />
        {isLoading && (
            <div className="center">
                <LoadingSpinner/>
            </div>
        )}
        {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
    );
};

export default Users;