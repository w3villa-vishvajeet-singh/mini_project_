"use client";
import { useState } from "react";
import axios from "axios";
import "../Register/page.css";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faFacebook, faGithub } from "@fortawesome/free-brands-svg-icons";
import { useRouter } from "next/navigation";

function Page() {
  const [token, setToken] = useState('');

  const [isOpen, setIsOpen] = useState(false);

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    mobileNumber: "",
    confirmPassword: "",
    password: "",
  });
  const [registrationStatus, setRegistrationStatus] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  function validateEmail(email) {
    const atSymbol = email.indexOf("@");
    if (atSymbol < 1) return false;
    const dot = email.indexOf(".");
    if (dot <= atSymbol + 1) return false;
    if (dot === email.length - 1) return false;
    if (email.indexOf(" ") !== -1) return false;
    return true;
  }

  function validatePassword(password) {
    if (password.length < 6) return false;
    if (!/[A-Za-z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    return true;
  }

  const google = ()=>{
    window.open("http://localhost:8001/api/auth/google", '_self')
}

const facebook = ()=>{
    window.open("http://localhost:8001/api/auth/facebook", '_self')
}


const github = ()=>{
    window.open("http://localhost:8001/api/auth/github/callback",'_self')
}


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, mobileNumber, password, confirmPassword } = formData;

    if (!validateEmail(email)) {
        setRegistrationStatus("Email is invalid");
        return;
    }

    if (!validatePassword(password)) {
        setRegistrationStatus("Password is invalid");
        return;
    }

    if (password !== confirmPassword) {
        setRegistrationStatus("Passwords do not match");
        return;
    }

  



    try {
        const response = await axios.post("http://localhost:8001/api/register", {
            username,
            email,
            mobileNumber,
            password,
            confirmPassword,
           
        });

        const { redirectToLogin, redirectToOTP, msg } = response.data;
        console.log("resonseeeeee",response);
        console.log("resonseeeeee",response.data);


        if(redirectToLogin){
          router.push('/users/login')
        }



       

        setRegistrationStatus(msg ,  "Registration failed");

        setFormData({
            username: "",
            email: "",
            mobileNumber: "",
            password: "",
            confirmPassword: "",
        });
    } catch (error) {
        console.error("Error  abc:", error.response?.data || error);

       
        if (error.response && error.response.status === 409) {
            setRegistrationStatus("The EmaiL already exists");
          // Redirect to OTP page
        } else {
            setRegistrationStatus(
                error.response?.data?.errors?.map((e) => e.msg).join(", ") ||
                error.response?.data?.msg ||
                "An error occurred."
            );
        }
    }
};


  return (
    <main>


<nav className="navbar navbar-expand-lg navbar-light bg-primary
">
      <div className="container">
        <Link href="/" className="navbar-brand">
          Vishvajeet
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          aria-controls="navbarNav"
          aria-expanded={isOpen ? 'true' : 'false'}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className={`nav-item ${router.pathname == '/' ? 'active' : ''}`}>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className={`nav-item ${router.pathname == '/about' ? 'active' : ''}`}>
              <Link href="/about" className="nav-link">
                About
              </Link>
            </li>
            <li className={`nav-item ${router.pathname == '/services' ? 'active' : ''}`}>
              <Link href="/services" className="nav-link">
                Services
              </Link>
            </li>
            <li className={`nav-item ${router.pathname == '/contact' ? 'active' : ''}`}>
              <Link href="/contact" className="nav-link">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>




      <div className="heading container-sm container-md container-lg container-xl container-xxl" >
        <form className="form_component" onSubmit={handleSubmit}>
          <h1 className="text_heading">Create your Account here</h1>
          {registrationStatus && <h1 className="status">{registrationStatus}</h1>}
          <div className="form">
            <div className="user_name">
              <label className="label_margin" htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="email">
              <label className="label_margin_email" htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="phone">
              <label className="label_margin_phone" htmlFor="mobileNumber">Number</label>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div className="confirm_password">
              <label className="label_margin_confrim_password" htmlFor="confirmPassword">
                <span>Confirm</span>
                <span>Password</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>
            <div className="password">
              <label className="label_margin_password" htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="submit">Submit</button>
            <p className="already_user">
              <Link href="/users/login">
                If you have already registered then click <span className="red">Login</span>
              </Link>
            </p>
          </div>
        </form>
        <div className="authentication">
          <h3>Login with Social Media</h3>
          <div className="box">
            <h4 className="google" onClick={google}><FontAwesomeIcon icon={faGoogle} /> Google</h4>
          </div>
          <div className="box">
            <h4 className="facebook" onClick={facebook}><FontAwesomeIcon icon={faFacebook} /> Facebook</h4>
          </div>
          <div className="box">
            <h4 className="github" onClick={github}><FontAwesomeIcon icon={faGithub} /> Github</h4>
          </div>
        </div>
      </div>
    </main>
  );
}

export default Page;
