import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./Profile.css";
import logo from "../Assets/diskominfo.png";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../Components/SideBar/Navbar.css";
import { axiosJWTadmin } from "../config/axiosJWT";
import { TabTitle } from "../TabName";
import icon from "../Assets/icon.png";
import Footer from "./footer";
import Profile from "../images/profile.png";
import Edit from "../images/edit.png";
import jwt_decode from "jwt-decode";
import { isUnauthorizedError } from "../config/errorHandling";
import { useNavigate } from "react-router-dom";
import { showSuccessNotification } from '../Components/User/toastSuccess';
import { showErrorNotification } from '../Components/User/toastFailed';

export const PresensiMagang = () => {
  TabTitle("Presensi Magang");
  const [showNav, setShowNav] = useState(false);
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);
  const [profilePicture, setProfilePicture] = useState(Profile);
  const navigate = useNavigate();
  const [nama, setNama] = useState("");
  const [tempImage, setTempImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);



  const handleNavLinkClick = (path) => {
    setActiveLink(path);
  };
  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setProfilePicture(decoded.foto_profil);


    } catch (error) {
      if (isUnauthorizedError(error)) {
        navigate("/");
      }
    }
  };

  const handlePictureChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        console.log("File loaded");
        setTempImage(reader.result);
        setIsModalOpen(true);
        console.log("isModalOpen set to true"); 
      };
      reader.readAsDataURL(file);
    }
  }; 
  const handleSubmit = async () => {
    try {
      const ambilid = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "admin",
        },
      });
  
      const decoded = jwt_decode(ambilid.data.token);
  
      if (!tempImage) {
        throw new Error('No image selected');
      }
  
      // Convert base64 to Blob
      const byteString = atob(tempImage.split(',')[1]);
      const mimeString = tempImage.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      const blob = new Blob([ab], { type: mimeString });
  
      const formData = new FormData();
      formData.append('image', blob, 'profile.png');
  
      console.log('FormData:', formData);
  
      const response = await axiosJWTadmin.patch(`http://localhost:3000/admin/edit-admin/${decoded.userId}/edit-foto-profil`, formData, {
        headers: {
          'role': "peserta_magang",
          'Content-Type': 'multipart/form-data'
        }
      });
  
      // console.log('Server Response:', response.data);
      showSuccessNotification("Berhasil Update Foto Profil");
      setIsModalOpen(false);
      setProfilePicture(tempImage);
    } catch (error) {
      console.error("Terjadi Kesalahan:", error);
      showErrorNotification("Gagal Update Foto Profil");
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTempImage(null);
  };

  return (
    <div className="body-main">
      <div className={`body-area${showNav ? " body-pd" : ""}`}>
        <header className={`header${showNav ? " body-pd" : ""}`}>
          <div className="header_toggle">
            <i
              className={`bi ${showNav ? "bi-x" : "bi-list"}`}
              onClick={() => setShowNav(!showNav)}
            />
          </div>
          <div className="header_img">
            <img src={icon} alt="" />
          </div>
        </header>
        <div className={`sidebar${showNav ? " open" : ""}`}>
          <div className="logo-details">
            <i className="bx bxl-c-plus-plus icon"></i>
            <a href="/homepage" target="_self" className="logo_name">
              <img
                src={logo}
                alt=""
                style={{ width: "120px", height: "auto" }}
              />
            </a>
            <i
              className="bi-list"
              id="btn"
              onClick={() => setShowNav(!showNav)}
            ></i>
          </div>
          <ul className="nav-list">
            <li>
              <a href="homepage">
                <i className="bi bi-house nav_icon" />
                <span className="links_name">Home</span>
              </a>
              <span className="tooltip">Home</span>
            </li>
            <li>
              <a href="admin">
                <i className="bi bi-person-check-fill nav_icon" />
                <span className="links_name">Admin</span>
              </a>
              <span className="tooltip">Admin</span>
            </li>
            <li>
              <a href="peserta">
                <i className="bi bi-person nav_icon" />
                <span className="links_name">Peserta</span>
              </a>
              <span className="tooltip">Peserta</span>
            </li>
            <li>
              <a href="presensi">
                <i className="bi bi-person-check nav_icon" />
                <span className="links_name">Presensi Magang</span>
              </a>
              <span className="tooltip">Presensi Magang</span>
            </li>
            <li>
              <a href="penugasan">
                <i className="bi bi-list-task nav_icon" />
                <span className="links_name">Penugasan</span>
              </a>
              <span className="tooltip">Penugasan</span>
            </li>
            <li>
              <a href="profile">
                <i className="bi bi-person nav_icon" />
                <span class="links_name">Profile</span>
              </a>
              <span class="tooltip">Profile</span>
            </li>
            <li className="profile">
              <a href="/">
                <i className="bi bi-box-arrow-left nav_icon"></i>
                <span className="links_name">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="container2">
          <p
            style={{
              fontFamily: "Poppins, sans-serif",
              fontSize: 25,
              marginBottom: 20,
            }}
          >
            Profil Admin
          </p>
        </div>
        <div className="home-section2">
          <div className="profile-picture">
            <img src={profilePicture || Profile} alt="Profile" className="profile-img" />
            <input
              type="file"
              accept="image/*"
              onChange={handlePictureChange}
              className="upload-input"
              id="file-input"
            />
            <label htmlFor="file-input" className="upload-button">
              <img src={Edit} alt="Edit" className="edit-icon" />
            </label>
          </div>
          <center>
            <strong>Selamat Datang, {nama}</strong>
          </center>
        </div>
      </div>

      {/* Modal */}
      <div className={`modal ${isModalOpen ? 'open' : ''}`} onClick={closeModal}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <span className="close" onClick={closeModal}>
            &times;
          </span>
          <h2>Preview</h2>
          <img src={tempImage} alt="Preview" className="modal-img square-img" />
          <button onClick={handleSubmit} className="submit-button">
            Ubah Foto Profil
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PresensiMagang;
