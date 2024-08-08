"use client";
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import "../login/page.css"
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle, faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";


function Page() {
    const router = useRouter(); 
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const google = ()=>{
        window.open("http://localhost:8001/api/auth/google", '_self')
    }

    const facebook = ()=>{
        window.open("http://localhost:8001/api/auth/linkedin/callback", '_self')
    }


    const github = ()=>{
        window.open("http://localhost:8001/api/auth/github/callback",'_self')
    }
    const [isOpen, setIsOpen] = useState(false);
  
    const handleToggle = () => {
      setIsOpen(!isOpen);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
  
        try {
            const response = await axios.post('http://localhost:8001/api/login', {
                email: formData.email,
                password: formData.password
            }, {
              headers: {
                'Content-Type' : 'application/json'
              }
            });

            console.log('Response:', response);

            if (response.status === 200) {
                alert('Login successful');
                localStorage.setItem('token', response.data.token);
                router.push('http://localhost:3000/'); // Redirect to home page
            } else if (response.status === 201) {
                alert(response.data.msg);
            } else if (response.status === 202) {
                alert(response.data.msg);
            } else {
                alert('Login failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred during login');
        }
    };

    return (
        <>


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






            <div className="heading">
                <h1 className="text_heading">Login your Account here</h1>

                <form onSubmit={handleSubmit}>
                    <div className="form">
                        <div className="email">
                            <label htmlFor="email" className="label_margin_email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="password">
                            <label htmlFor="password" className="label_margin_password">Password</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <button type="submit" className='login_btn'>Login</button>
                        <p className="already_user">
                            <Link href="/users/Register">If you have not registered yet, click <span className='red'>Register</span></Link>
                        </p>
                    </div>
                </form>

                <div className="authentication">
                    <h3>Login with Social Media</h3>
                    <div className="box" >
                        <h4 className='google' onClick={google}>
                            <FontAwesomeIcon icon={faGoogle} /> Google
                        </h4>
                    </div>
                    <div className="box">
                        <h4 className='facebook' onClick={facebook}>
                            <FontAwesomeIcon icon={faLinkedin} /> Linkedin
                        </h4>
                    </div>
                    <div className="box">
                        <h4  onClick={github}>
                            <FontAwesomeIcon icon={faGithub} /> Github
                        </h4>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Page;
