//Upender Code
import React, { useState,useContext } from "react";
import Input from "../../shared/components/FormElements/Input";
import Button from "../../shared/components/FormElements/Button";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";

import { useForm } from "../../shared/hooks/form-hook";

import "./Auth.css";
import Card from "../../shared/components/UIElements/Card";
import { useHttpClient } from "../../shared/hooks/http-hook";

import {
  VALIDATOR_EMAIL,
  VALIDATOR_MINLENGTH,
  VALIDATOR_REQUIRE,
} from "../../shared/util/validators";

import { AuthContext } from "../../shared/components/context/auth-context";

const Auth = () => {
    const auth = useContext(AuthContext);

  const [isLoginMode, setIsLoginMode] = useState(true);

  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();

  const {isLoading,error,sendRequest,clearError} = useHttpClient();

  const [formState, inputHandler, setFormData] = useForm({
    email: {
      value: "",
      isValid: false,
    },
    password: {
      value: "",
      isValid: false,
    },
  });

  

  const switchModeHandler = () => {
    if(!isLoginMode){
        setFormData({
            ...formState.inputs,
            name:undefined
        }, formState.inputs.email.isValid && formState.inputs.password.isValid );
    }else {
        setFormData({
            ...formState.inputs,
            name: {
                value: '',
                isValid: false
            }
        },false);
    };
    
    setIsLoginMode((prevMode) => !prevMode);
  };

  //upender
  const authSubmitHandler = async (event) => {
    event.preventDefault();
    //console.log(formState.inputs);
    //setIsLoading(true);

    if(isLoginMode){
      try{
          const responseData = await sendRequest(
            'http://localhost:5000/api/users/login',
            'POST',
            JSON.stringify({
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type': 'application/json'
          }
        );

        // const responseData = await response.json();

        // if(!response.ok){
        //   throw new Error(responseData.message);
        // }

        //console.log(responseData);
        //setIsLoading(false);
        auth.login(responseData.user.id);
      }catch(err){
        //console.log(err.JSON);
        //setIsLoading(false);
        //setError(err.message || 'Something went wrong, please try again');
      }      

    }else{

      try{
        //const response = await fetch('http://localhost:5000/api/users/signup',{
          
          const responseData = await sendRequest('http://localhost:5000/api/users/signup', 
          'POST',
          JSON.stringify({
            name:formState.inputs.name.value,
            email: formState.inputs.email.value,
            password: formState.inputs.password.value
          }),
          {
            'Content-Type' : 'application/json'
          },
        );

        //const responseData = await response.json();

        // if(!response.ok){
        //   throw new Error(responseData.message);
        // }

        // console.log(responseData);
        // setIsLoading(false);
        auth.login(responseData.user.id);
      }catch(err){
        // console.log(err.JSON);
        // setIsLoading(false);
        // setError(err.message || 'Something went wrong, please try again');
      }

    }

   // setIsLoading(false);
    
  };

  // const errorHandler = () => {
  //   //setError(null);
  //   clearError();
  // };
  
  //Upender
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError}/>
    <Card className="authentication">
      { isLoading && <LoadingSpinner asOverlay/> }
      
      <h2> Login Required </h2>
      <hr />
      <form onSubmit={authSubmitHandler}>
        {!isLoginMode && (
          <Input
            element="input"
            id="name"
            type="text"
            label="Your Name"
            validators={[VALIDATOR_REQUIRE()]}
            errorText="Please enter a name."
            onInput={inputHandler}
          />
        )}
        <Input
          element="input"
          id="email"
          type="email"
          label="E-Mail"
          validators={[VALIDATOR_EMAIL()]}
          errorText="Please enter valid email address"
          onInput={inputHandler}
        />

        <Input
          element="input"
          id="password"
          type="password"
          label="Password"
          validators={[VALIDATOR_MINLENGTH(5)]}
          errorText="Please enter password atleast 5 charectors"
          onInput={inputHandler}
        />
        <Button type="submit" disabled={!formState.isValid}>          

          {isLoginMode ? "LOGIN" : "SIGNUP"}
        </Button>
      </form>

      <Button inverse onClick={switchModeHandler}>
        SWITCH TO {isLoginMode ? "SIGNUP" : "LOGIN"}
      </Button>
    </Card>
    </React.Fragment>
  );
};

export default Auth;
