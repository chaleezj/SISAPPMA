import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../Assets/diskominfo.png";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "../../Components/SideBar/Navbar.css";
import "./Profil.css";
import icon from "../../Assets/icon.png";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { isUnauthorizedError } from "../../config/errorHandling";
import { showSuccessNotification } from '../../Components/User/toastSuccess';
import { showErrorNotification } from '../../Components/User/toastFailed';
import Footer from "./footer";
import Profile from "../../images/profile.png";
import Edit from "../../images/edit.png";
import { axiosJWTuser } from '../../config/axiosJWT';

const Profil = () => {
  const [nama, setNama] = useState("");
  const navigate = useNavigate();
  const [username, setUserName] = useState("");
  const [asal_univ, setAsalUniv] = useState("");
  const [asal_jurusan, setAsalJurusan] = useState("");
  const [no_telp, setNoTelp] = useState("");
  const [showNav, setShowNav] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [tempImage, setTempImage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    refreshToken();
  }, []);

  const refreshToken = async () => {
    try {
      const response = await axios.get("http://localhost:3000/account/token", {
        headers: {
          role: "peserta_magang",
        },
      });
      const decoded = jwt_decode(response.data.token);
      setNama(decoded.nama);
      setUserName(decoded.username);
      setAsalUniv(decoded.asal_univ);
      setAsalJurusan(decoded.asal_jurusan);
      setNoTelp(decoded.no_telp);
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
      const ambilid = await axios.get('http://localhost:3000/account/token', {
        headers: {
          'role': "peserta_magang"
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
      console.log('Nomer:', no_telp);
  
      const response = await axiosJWTuser.patch(`http://localhost:3000/user/peserta/${decoded.userId}/edit-foto-profil`, formData, {
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
          <div className="header_toggle"></div>
          <div className="header_img">
            <img src={icon} alt="" />
          </div>
        </header>
        <div className={`sidebar${showNav ? " open" : ""}`}>
          <div className="logo-details">
            <i className="bx bxl-c-plus-plus icon"></i>
            <a href="/user/homepage" target="_self" className="logo_name">
              <img
                src={logo}
                alt=""
                style={{ width: "120px", height: "auto" }}
              />
            </a>
            <i
              className="bi bi-list"
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
              <a href="riwayat">
                <i className="bi bi-card-checklist nav_icon" />
                <span className="links_name">History Presensi</span>
              </a>
              <span className="tooltip">History Presensi</span>
            </li>
            <li>
              <a href="presensi">
                <i className="bi bi-camera nav_icon" />
                <span className="links_name">Lakukan Presensi</span>
              </a>
              <span className="tooltip">Lakukan Presensi</span>
            </li>
            <li>
              <a href="tugas">
                <i className="bi bi-list-task nav_icon" />
                <span className="links_name">Penugasan</span>
              </a>
              <span className="tooltip">Penugasan</span>
            </li>
            <li>
              <a href="surat">
                <i className="bi bi-envelope nav_icon" />
                <span className="links_name">Persuratan</span>
              </a>
              <span className="tooltip">Persuratan</span>
            </li>
            <li>
              <a href="profil">
                <i className="bi bi-person nav_icon"></i>
                <span className="links_name">Profile</span>
              </a>
              <span className="tooltip">Profile</span>
            </li>
            <li className="profile">
              <a href="/">
                <i className="bi bi-box-arrow-left nav_icon"></i>
                <span className="links_name">Sign Out</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="home-section3">
          <div className="profile-picture3">
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
          <div className="homepage-container">
            <div>
              <h2>Profil Pengguna</h2>
              <p>
                <strong>Selamat Datang, {nama}</strong>
              </p>
              <p>
                <strong>Username:</strong> {username}
              </p>
              <p>
                <strong>Asal Universitas:</strong> {asal_univ}
              </p>
              <p>
                <strong>Asal Jurusan:</strong> {asal_jurusan}
              </p>
              <p>
                <strong>Nomor Telepon:</strong> {no_telp}
              </p>
            </div>
          </div>
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

export default Profil;
