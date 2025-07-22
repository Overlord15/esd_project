// src/components/Login.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import styled from "styled-components";

// --- Styled Components ---

const Wrapper = styled.div`
  background: linear-gradient(180deg, #745be7 0%, #352477 40%, #eaefff 100%);
  min-height: 100vh;
  color: #23262f;
  font-family: "Inter", "Ubuntu", Arial, sans-serif;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem 1rem;

  @media (min-width: 800px) {
    align-items: center;
  }
`;

// const NavBar = styled.nav`
//   width: 100%;
//   max-width: 1200px;
//   padding: 2rem 6vw 0 6vw;
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   position: absolute;
//   top: 0;
// `;

// const Logo = styled.h1`
//   font-size: 2.2rem;
//   font-weight: 700;
//   letter-spacing: -2px;
//   color: #ffffff;
// `;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-radius: 22px;
  border: 1.5px solid rgba(176, 162, 254, 0.4);
  padding: 3rem 2.5rem;
  width: 100%;
  max-width: 580px;
  box-shadow: 0 6px 32px #00000033;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #fff;
  text-align: center;
  margin-bottom: 2rem;
  letter-spacing: -1px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.3rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.3rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.95rem;
  color: #e0d2ff;
  font-weight: 500;
`;

const Input = styled.input`
  background: rgba(255, 255, 255, 0.15);
  border: 1.5px solid rgba(176, 162, 254, 0.3);
  border-radius: 12px;
  padding: 1rem;
  font-size: 1rem;
  color: #fff;
  outline: none;
  transition: border 0.2s, background 0.2s;
  width: 100%;

  &:focus {
    border-color: #b49dff;
    background: rgba(255, 255, 255, 0.2);
  }

  &::placeholder {
    color: #c6b4ff;
    opacity: 0.7;
  }
`;

const Error = styled.div`
  background: rgba(255, 99, 71, 0.15);
  color: #ff6347;
  border: 1.5px solid #ff6347;
  border-radius: 12px;
  padding: 0.85rem;
  margin-bottom: 1rem;
  font-size: 0.95rem;
`;

const Button = styled.button`
  background: #5c4be7;
  color: #fff;
  border: none;
  border-radius: 36px;
  padding: 1rem 2rem;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 1rem;

  &:hover {
    background: #3726c9;
  }

  &:disabled {
    background: #5c4be7;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ToggleText = styled.p`
  color: #8b94b1;
  font-size: 1rem;
  text-align: center;
  margin-top: 1.5rem;
  cursor: pointer;
  transition: color 0.2s;

  &:hover {
    color: #4f46e5;
  }
`;

// --- Main Login Component ---

const Login: React.FC = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    screenName: "",
    password: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate("/dashboard");
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]:
        (e.target as HTMLInputElement).value.trim() || "",
    });
  };

  const storeUserSession = async (user: any, userData: any) => {
    const sessionData = {
      uid: user.uid,
      email: user.email,
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      screenName: userData.screenName || "",
      createdAt: userData.createdAt || new Date().toISOString(),
    };
    localStorage.setItem("userSession", JSON.stringify(sessionData));
    localStorage.setItem("isAuthenticated", "true");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { firstName, lastName, email, screenName, password } = formData;

    try {
      if (isRegister) {
        // Registration
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const newUserData = {
          uid: userCredential.user.uid,
          firstName,
          lastName,
          email,
          screenName,
          createdAt: new Date().toISOString(),
        };
        await addDoc(collection(db, "users"), newUserData);
        await storeUserSession(userCredential.user, newUserData);
        navigate("/dashboard");
      } else {
        // Login
        const q = query(collection(db, "users"), where("screenName", "==", screenName));
        const snapshot = await getDocs(q);
        if (snapshot.empty) throw new globalThis.Error("No user found with this screen name.");
        const userData = snapshot.docs[0].data();
        const userCredential = await signInWithEmailAndPassword(
          auth,
          userData.email,
          password
        );
        await storeUserSession(userCredential.user, userData);
        navigate("/dashboard");
      }
    } catch (err: any) {
      // User-friendly error handling
      if (err.code === "auth/invalid-credential") {
        setError("Invalid credentials.");
      } else if (err.code === "auth/email-already-in-use") {
        setError("Email already in use.");
      } else if (!isRegister && !formData.screenName) {
        setError("Please provide your screen name.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Wrapper>
      <Card>
        <Title>{isRegister ? "Register" : "Login"}</Title>
        {error && <Error>{error}</Error>}
        <Form onSubmit={handleSubmit}>
          {isRegister && (
            <>
              <FormRow>
                <FormGroup>
                  <Label>First Name</Label>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Enter first name"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Last Name</Label>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Enter last name"
                    required
                  />
                </FormGroup>
              </FormRow>
              <FormRow>
                <FormGroup>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    required
                  />
                </FormGroup>
                <FormGroup>
                  <Label>Screen Name</Label>
                  <Input
                    type="text"
                    name="screenName"
                    value={formData.screenName}
                    onChange={handleChange}
                    placeholder="Enter screen name"
                    required
                  />
                </FormGroup>
              </FormRow>
            </>
          )}
          {!isRegister && (
            <FormGroup>
              <Label>Screen Name</Label>
              <Input
                type="text"
                name="screenName"
                value={formData.screenName}
                onChange={handleChange}
                placeholder="Enter screen name"
                required
              />
            </FormGroup>
          )}
          <FormGroup>
            <Label>Password</Label>
            <Input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
          </FormGroup>
          <Button type="submit" disabled={loading}>
            {loading ? "Processing..." : isRegister ? "Register" : "Login"}
          </Button>
        </Form>
        <ToggleText
          onClick={() => {
            setIsRegister(!isRegister);
            setError(null);
            setFormData({
              firstName: "",
              lastName: "",
              email: "",
              screenName: "",
              password: "",
            });
          }}
        >
          {isRegister
            ? "Already have an account? Login"
            : "Don't have an account? Register"}
        </ToggleText>
      </Card>
    </Wrapper>
  );
};

export default Login;
