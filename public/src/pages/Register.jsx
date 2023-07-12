import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
const Register = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };
  const handleChange=(event)=>{

  }
  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className="brand">
            <img src="" alt="" />
            <h1>Snapy</h1>
          </div>
          <input
            type="text"
            placeholder="Username"
            name="username"
            onChange={handleChange(e)}
          />
          <input
            type="email"
            placeholder="Email"
            name="email"
            onChange={handleChange(e)}
          />
          <input
            type="password"
            placeholder="password"
            name="password"
            onChange={handleChange(e)}
          />
          <input
            type="password"
            placeholder="Confirm password"
            name="password"
            onChange={handleChange(e)}
          />
          <button type="submit">Create User</button>
          <span>
            Already have an account? <Link to="/login">Login</Link>{" "}
          </span>
        </form>
      </FormContainer>
    </>
  );
};
const FormContainer = styled.div``;

export default Register;
